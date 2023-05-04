'use strict';


function drawScreen() {

    ctx.clearRect(0,0,GAMEWIDTH,GAMEHEIGHT);

    //draws the main screen
    // let background = {
    //     image : new Image()
    // }
    // background.image.src = "./spriteSheets/backgroundDay.png";

    // ctx.drawImage(background.image, 0, 0);

    let size = [roadSegmentWidth, roadSegmentLength];
    let roadSegmentList = bezColl.getPointTangents(15);
    let points = [];
    let edges = [];

    for (let i = 0; i < roadSegmentList.length; i++) {

        if (
            Math.abs(roadSegmentList[i].point.x - playerList[0].x) < renderDistance &&
            Math.abs(roadSegmentList[i].point.y - playerList[0].y) < renderDistance
            ) {
            
            let relativeCenterVector = Vector.subtract(
                roadSegmentList[i].point,  new Vector(playerList[0].x, playerList[0].y)
            );

            let vec = Vector.normalize(roadSegmentList[i].tangent);
            relativeCenterVector.rotate2d(playerList[0].directionVector.angle);
            vec.rotate2d(playerList[0].directionVector.angle);

            let corners = [];
                let x = relativeCenterVector.x;
                let y = relativeCenterVector.y;
                x += vec.x*(size[1]/2);
                y += vec.y*(size[1]/2);
                vec.rotate2d(Math.PI/2);
                x += vec.x*(size[0]/2);
                y += vec.y*(size[0]/2);
                corners.push(new Vector(x, y, -2));
            for (let i = 0; i < 3; i++) {
                vec.rotate2d(Math.PI/2);
                x += vec.x*size[!(i % 2)*1];
                y += vec.y*size[!(i % 2)*1];
                corners.push(new Vector(x, y, -2));
            }

            points.push(corners);
            edges.push([0,1,2,3,0]);
        } 

        // let P = new Plant   ({
        //                         "X": "F-[[X]+X]+F[+FX]-X",
        //                         "F": "FF"
        //                     }, 25);

        // let txt = (P.cycleMultiple("X", 6));
        // P.drawBranchStack(txt, new Vector(WIDTH/4, HEIGHT/2), new Vector(3, 0));
    }


    ctx.fillStyle = 'green';
    ctx.fillRect(0, GAMEHEIGHT/2, GAMEWIDTH, GAMEHEIGHT/2);

    let screenCoordinates = [];

    for (let j = 0; j < points.length; j++) {
        for (let i = 0; i < points[j].length; i++) {
            let cameraToPointVector = new Vector(
                points[j][i].x - cameraPosition.x,
                points[j][i].y - cameraPosition.y,
                points[j][i].z - cameraPosition.z
            );

            const zDiff = cameraToPointVector.y;
            
            // if (zDiff > cameraDepth) {
                let screenScale = cameraDepth/zDiff;
                screenCoordinates.push([
                    GAMEWIDTH - GAMEWIDTH*(1 + points[j][i].x*screenScale)/2, 
                    GAMEHEIGHT - GAMEHEIGHT/2 - points[j][i].z*screenScale*GAMEHEIGHT/2, 
                    screenScale]);
            // }
        }
    }

    // console.log(screenCoordinates);
    ctx.fillStyle = 'grey';

    ctx.lineWidth = 3;
    for (let i = 0; i < edges.length; i++) {
        ctx.beginPath();
        ctx.moveTo(
            screenCoordinates[4*i + edges[i][0]][0], 
            screenCoordinates[4*i + edges[i][0]][1]
        );
        for (let j = 1; j < edges[i].length; j++) {
            if (screenCoordinates[4*i + edges[i][j]][1] > GAMEHEIGHT/2) {
                ctx.lineTo(
                    screenCoordinates[4*i + edges[i][j]][0], 
                    screenCoordinates[4*i + edges[i][j]][1]
                ); 
            }
        }
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        //draw car pov and score, rotete ik -liam
        ctx.drawImage(carOverlayObj, 0, 0, 850, 450);
        ctx.fillStyle = "yellow";
        ctx.fillText("SCORE:", 20, 35);
        ctx.fillText((bezColl.currentLastIndex-2).toString(), 140, 35);
        ctx.fillStyle = "grey";
        
    }

    ctx.fillStyle = 'black';
    for (let i = 0; i < screenCoordinates.length; i++) {
        if (screenCoordinates[i][2] > 0) {
            ctx.beginPath();
            ctx.arc(
                screenCoordinates[i][0], 
                screenCoordinates[i][1],
                40*screenCoordinates[i][2],
                0, 2*Math.PI
            );
            ctx.fill();
        }
    }
    
}

function drawMiniMap() {
    //draws the minimap
    ctxMap.fillStyle = "green";
    ctxMap.fillRect(0, 0, WIDTH,GAMEHEIGHT);
    
    let roadSegmentList = bezColl.getPointTangents(15);

    // let roadSegmentList = [
    //     {
    //         point  : new Vector(WIDTH/(2*WORLDSCALE),GAMEHEIGHT/(2*WORLDSCALE) - 50),
    //         tangent: new Vector(0,-1)
    //     },
    //     {
    //         point  : new Vector(WIDTH/(2*WORLDSCALE) + 50,GAMEHEIGHT/(2*WORLDSCALE) - 50),
    //         tangent: new Vector(1,-1)
    //     }
    // ]


    for (let i = 0; i < roadSegmentList.length; i++) {

        if (
            Math.abs(roadSegmentList[i].point.x - playerList[0].x) < renderDistance &&
            Math.abs(roadSegmentList[i].point.y - playerList[0].y) < renderDistance
            ) {

            drawRelativeVectorRect(
                playerList[0], 
                roadSegmentList[i].point, 
                roadSegmentList[i].tangent, 
                [roadSegmentWidth*WORLDSCALE, roadSegmentLength*WORLDSCALE], 
                'gray'
            );

            drawRelativeVectorRect(
                playerList[0], 
                roadSegmentList[i].point, 
                roadSegmentList[i].tangent, 
                [0.2*WORLDSCALE, 3*WORLDSCALE], 
                'yellow'
            );
        } 
    }

    let plantsArr = bezColl.getPlants();
    for (let i = 0; i < plantsArr.length; i++) {
        let plant = plantsArr[i];
        // drawRelativeCircle(playerList[0], plant.position, plant.size, plant.color);
    }

    let stoneCenterPos = new Vector(WIDTH/(2*WORLDSCALE) - 10,GAMEHEIGHT/(2*WORLDSCALE) - 20);
    let stoneRadius = 2;
    drawRelativeCircle(playerList[0], stoneCenterPos, stoneRadius, 'black');

    playerList[0].drawToMiniMap();
}

function drawRelativeVectorRect(player, centerVector, directionVectorOriginal, size, color) {
    let directionVector = Vector.copy(directionVectorOriginal);
    let diffVector = Vector.subtract( 
        centerVector,
        new Vector(player.x, player.y)
    );
    diffVector.rotate2d(player.directionVector.angle);
    directionVector.rotate2d(player.directionVector.angle);

    drawVectorRect(WIDTH/2 - diffVector.x*WORLDSCALE,GAMEHEIGHT/2 - diffVector.y*WORLDSCALE, 
        directionVector, 
        size, 
        color
    );
}

function drawRelativeCircle(player, centerVector, size, color) {
    let diffVector = Vector.subtract( 
        centerVector,
        new Vector(player.x, player.y)
    );
    diffVector.rotate2d(player.directionVector.angle);

    ctxMap.fillStyle = color;
    ctxMap.beginPath();
    ctxMap.arc(
        WIDTH/2 - diffVector.x*WORLDSCALE, 
       GAMEHEIGHT/2 - diffVector.y*WORLDSCALE,
        size*WORLDSCALE, 0, 2*Math.PI
    );
    ctxMap.fill();
}

function drawVectorRect(centerX, centerY, directionVector, size, color) {
   // example:
   // centerX = 100
   // centerY = 100
   // directionVector = Vector(10,0)
   // size = [20,40]
   let vec = Vector.normalize(directionVector);
       let corners = [];
           let x = centerX;
           let y = centerY;
           x += vec.x*(size[1]/2);
           y += vec.y*(size[1]/2);
           vec.rotate2d(Math.PI/2);
           x += vec.x*(size[0]/2);
           y += vec.y*(size[0]/2);
           corners.push([x, y]);
           for (let i = 0; i < 3; i++) {
               vec.rotate2d(Math.PI/2);
               x += vec.x*size[!(i % 2)*1];
               y += vec.y*size[!(i % 2)*1];
               corners.push([x, y]);
           }

       ctxMap.fillStyle = color;
       ctxMap.beginPath();
       ctxMap.moveTo(corners[3][0], corners[3][1]);
       for (let i = 0; i < corners.length; i++) {
           ctxMap.lineTo(corners[i][0], corners[i][1]);
       }
       ctxMap.closePath();
       ctxMap.fill();
}

function loop() {
    
    ctx.clearRect(0, 0, WIDTH,GAMEHEIGHT);

    if (gameState == "Cotus Lurbo Thallenge") {
        menu();
    }
    else if (gameState == "Play") {
        play();
    }
    else if (gameState == "Settings") {
        settings();
    }
    else if (gameState == "Credits") {
        credits();
    }
    else if (gameState == "Game") {
        game();
    }
    else {
        console.log("game state error");
    }

    window.requestAnimationFrame(loop);
}

function menu() {
    scrollQueue();

    if (keyPresses[menuControls.select]) {
        gameStateChange(menuOptions[currentOption]);
    }

    currentOption += keyPresses[menuControls.down] - keyPresses[menuControls.up];

    if (currentOption < 0) {
        currentOption = 0;
    }
    if (currentOption > menuOptions.length - 1) {
        currentOption = menuOptions.length - 1;
    }

    drawOptions(menuOptions);

}

function play() {
    scrollQueue();

    if (keyPresses[menuControls.back]) {
        gameStateChange("Cotus Lurbo Thallenge");
    }
    if (keyPresses[menuControls.select] && playOptions[currentOption] == "Start") {
        gameStateChange("Game");
    }
    // if (playOptions[currentOption][0] == "Map") {
    //     playOptions[currentOption][1] = listScroll(playOptions[currentOption][1], maps);
    // }
    if (playOptions[currentOption][0] == "Car") {
        playOptions[currentOption][1] = listScroll(playOptions[currentOption][1], cars);
    }

    currentOption += keyPresses[menuControls.down] - keyPresses[menuControls.up];

    if (currentOption < 0) {
        currentOption = 0;
    }
    if (currentOption > playOptions.length - 1) {
        currentOption = playOptions.length - 1;
    }

    drawOptions(playOptions);
}

function settings() {
    scrollQueue();

    if (keyPresses[menuControls.back]) {
        gameStateChange("Cotus Lurbo Thallenge");
    }
    if (settingsOptions[currentOption][0] == "Master Volume" || settingsOptions[currentOption][0] == "Music Volume" || settingsOptions[currentOption][0] == "FX Volume") {
        settingsOptions[currentOption][1] = slider(settingsOptions[currentOption][1], 0, 100);
    }


    currentOption += keyPresses[menuControls.down] - keyPresses[menuControls.up];

    if (currentOption < 0) {
        currentOption = 0;
    }
    if (currentOption > settingsOptions.length - 1) {
        currentOption = settingsOptions.length - 1;
    }

    drawOptions(settingsOptions);

}

function credits() {
    scrollQueue();

    if (keyPresses[menuControls.back]) {
        gameStateChange("Cotus Lurbo Thallenge");
    }

    currentOption += keyPresses[menuControls.down] - keyPresses[menuControls.up];

    if (currentOption < 0) {
        currentOption = 0;
    }
    if (currentOption > settingsOptions.length - 1) {
        currentOption = settingsOptions.length - 1;
    }

    drawOptions(creditsOptions);
}

function game() {
    for (let i = 0; i < playerList.length; i++) {
        playerList[i].update();
    }

    bezColl.updatePassed(new Vector(playerList[0].x, playerList[0].y));

    drawScreen();
    drawMiniMap();
}

function gameStateChange(state) {
    queue = [];
    keyPresses = {};
    if (state == "Cotus Lurbo Thallenge") {
        gameState = "Cotus Lurbo Thallenge";
        keyPresses[menuControls.up] = false;
        keyPresses[menuControls.down] = false;
        keyPresses[menuControls.left] = false;
        keyPresses[menuControls.right] = false;
        keyPresses[menuControls.select] = false;
        keyPresses[menuControls.back] = false;
        currentOption = 0;
    }
    else if (state == "Play") {
        gameState = "Play";
        keyPresses[menuControls.up] = false;
        keyPresses[menuControls.down] = false;
        keyPresses[menuControls.left] = false;
        keyPresses[menuControls.right] = false;
        keyPresses[menuControls.select] = false;
        keyPresses[menuControls.back] = false;
        currentOption = 0;
    }
    else if (state == "Settings") {
        gameState = "Settings";
        keyPresses[menuControls.up] = false;
        keyPresses[menuControls.down] = false;
        keyPresses[menuControls.left] = false;
        keyPresses[menuControls.right] = false;
        keyPresses[menuControls.select] = false;
        keyPresses[menuControls.back] = false;
        currentOption = 0;
    }
    else if (state == "Credits") {
        gameState = "Credits";
        keyPresses[menuControls.up] = false;
        keyPresses[menuControls.down] = false;
        keyPresses[menuControls.left] = false;
        keyPresses[menuControls.right] = false;
        keyPresses[menuControls.select] = false;
        keyPresses[menuControls.back] = false;
        currentOption = 0;
    }
    
    else if (state == "Game") {
        gameState = "Game";
        keyPresses[gameControls.pause] = false;
        keyPresses[gameControls.p1Accelerate] = false;
        keyPresses[gameControls.p1Decelerate] = false;
        keyPresses[gameControls.p1Left] = false;
        keyPresses[gameControls.p1Right] = false;
        keyPresses[gameControls.p1Shift] = false;
        keyPresses[gameControls.p2Accelerate] = false;
        keyPresses[gameControls.p2Decelerate] = false;
        keyPresses[gameControls.p2Left] = false;
        keyPresses[gameControls.p2Right] = false;
        keyPresses[gameControls.p2Shift] = false;
        playerList = [
            new Player(0, 0, "ongelsk")
        ];
    }
    else {
        console.log("gameStateChange error");
    }
    // console.log(gameState);
    // console.log(keyPresses);
}


function listScroll(current, list) {
    if (list.indexOf(current) - 1 < 0) {
        return list[list.indexOf(current) + keyPresses[menuControls.right]];
    }
    else if (list.indexOf(current) + 2 > maps.length) {
        return list[list.indexOf(current) - keyPresses[menuControls.left]];
    }
    else {
        return list[list.indexOf(current) + keyPresses[menuControls.right] - keyPresses[menuControls.left]];
    }
}

function slider(current, min, max) {
    if (current - 1 < min) {
        return current + keyPresses[menuControls.right];
    }
    else if (current + 1 > max) {
        return current - keyPresses[menuControls.left];
    }
    else {
        return current + keyPresses[menuControls.right] - keyPresses[menuControls.left];
    }
}

function scrollQueue() {
    if (queue.length > 0) {
        if (keyPresses[queue[0]] == false) {
            keyPresses[queue[0]] = true;
        }
        else {
            keyPresses[queue[0]] = false;
        }
        queue.shift()
    }
}

function drawOptions(options) {

    let textMargin = GAMEWIDTH / 20;
    let optionMargin = GAMEWIDTH / 3
    let textSpacing = GAMEWIDTH / 30
    let titleSize = GAMEWIDTH / 30;
    let textSize = GAMEWIDTH / 40;
    let textCenter = GAMEWIDTH / 5


    // ctx.strokeRect(40,GAMEHEIGHT / 2 - 35, 350, 45);

    ctx.font = titleSize + "px Monocraft";
    ctx.fillText(gameState, textMargin, 150);

    ctx.font = textSize + "px Monocraft";

    if (options[currentOption].length != 2) {
        ctx.fillText(options[currentOption], textMargin, textCenter);
    }
    else {
        ctx.fillText(options[currentOption][0], textMargin, textCenter);
        ctx.fillText(options[currentOption][1], optionMargin, textCenter);
    }

    for (let i = 1; i < 10; i++) {
        ctx.font = (textSize - 15 * i) + "px Monocraft";

        if (options[currentOption + i]) {
            if (options[currentOption + i].length != 2) {
                ctx.fillText(options[currentOption + i], textMargin, (textCenter) + textSpacing * i);
            }
            else {
                ctx.fillText(options[currentOption + i][0], textMargin, (textCenter) + textSpacing * i);
                ctx.fillText(options[currentOption + i][1], optionMargin, (textCenter) + textSpacing * i);
            }
        }
    }
    if (options[currentOption - 1]) {
        ctx.font = (textSize - 15) + "px Monocraft";

        if (options[currentOption - 1].length != 2) {
            ctx.fillText(options[currentOption - 1], textMargin, (textCenter) - textSpacing);
        }
        else {
            ctx.fillText(options[currentOption - 1][0], textMargin, (textCenter) - textSpacing);
            ctx.fillText(options[currentOption - 1][1], optionMargin, (textCenter) - textSpacing);
        }
    }
}
