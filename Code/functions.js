'use strict';


function drawScreen() {

    ctx.clearRect(0,0,GAMEWIDTH,GAMEHEIGHT);

    //draws the main screen
    // let background = {
    //     image : new Image()
    // }
    // background.image.src = "./spriteSheets/backgroundDay.png";

    // ctx.drawImage(background.image, 0, 0);

    let size = [3,10];
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
            relativeCenterVector.rotate2d(player.directionVector.angle);
            vec.rotate2d(player.directionVector.angle);

            let corners = [];
                let x = relativeCenterVector.x;
                let y = relativeCenterVector.y;
                x += vec.x*(size[1]/2);
                y += vec.y*(size[1]/2);
                vec.rotate2d(Math.PI/2);
                x += vec.x*(size[0]/2);
                y += vec.y*(size[0]/2);
                corners.push(new Vector(x, y, -1));
            for (let i = 0; i < 3; i++) {
                vec.rotate2d(Math.PI/2);
                x += vec.x*size[!(i % 2)*1];
                y += vec.y*size[!(i % 2)*1];
                corners.push(new Vector(x, y, -1));
            }

            points.append(corners);
            edges.append([0,1,2,3,0]);
        } 
    }


    ctx.fillStyle = 'green';
    ctx.fillRect(0, GAMEHEIGHT/2, GAMEWIDTH, GAMEHEIGHT/2);

    let screenCoordinates = [];

    for (let j = 0; j < points.length; j++) {
        for (let i = 0; i < points.length[j]; i++) {
            let cameraToPointVector = new Vector(
                points[j][i].x - cameraPosition.x,
                points[j][i].y - cameraPosition.y,
                points[j][i].z - cameraPosition.z
            );

            const zDiff = cameraToPointVector.y;

            if (zDiff > cameraDepth) {
                let screenScale = cameraDepth/zDiff;
                screenCoordinates.push([
                    GAMEWIDTH/2 + points[j][i].x*screenScale*GAMEHEIGHT/2, 
                    GAMEHEIGHT/2 + points[j][i].z*screenScale*GAMEHEIGHT/2, 
                    screenScale]);
            }
        }
    }

    for (let i = 0; i < screenCoordinates.length; i++) {
        ctx.beginPath();
        ctx.arc(
            screenCoordinates[i][0], 
            screenCoordinates[i][1],
            20*screenCoordinates[i][2],
            0, 2*Math.PI
        );
        ctx.fill();        
    }

    ctx.lineWidth = 5;
    for (let i = 0; i < edges.length; i++) {
        ctx.moveTo(
            screenCoordinates[edges[i][0]][0], 
            screenCoordinates[edges[i][0]][1]
        );
        for (let j = 1; j < edges[i].length; j++) {
            ctx.lineTo(
                screenCoordinates[edges[i][j]][0], 
                screenCoordinates[edges[i][j]][1]
            ); 
        }
        ctx.stroke();
    }
    
}

function drawMiniMap() {
    //draws the minimap
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    let roadSegmentList = bezColl.getPointTangents(15);

    // let roadSegmentList = [
    //     {
    //         point  : new Vector(WIDTH/(2*WORLDSCALE), HEIGHT/(2*WORLDSCALE) - 50),
    //         tangent: new Vector(0,-1)
    //     },
    //     {
    //         point  : new Vector(WIDTH/(2*WORLDSCALE) + 50, HEIGHT/(2*WORLDSCALE) - 50),
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

    let stoneCenterPos = new Vector(WIDTH/(2*WORLDSCALE) - 10, HEIGHT/(2*WORLDSCALE) - 20);
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

    drawVectorRect(WIDTH/2 - diffVector.x*WORLDSCALE, HEIGHT/2 - diffVector.y*WORLDSCALE, 
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

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(
        WIDTH/2 - diffVector.x*WORLDSCALE, 
        HEIGHT/2 - diffVector.y*WORLDSCALE,
        size*WORLDSCALE, 0, 2*Math.PI
    );
    ctx.fill();
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

       ctx.fillStyle = color;
       ctx.beginPath();
       ctx.moveTo(corners[3][0], corners[3][1]);
       for (let i = 0; i < corners.length; i++) {
           ctx.lineTo(corners[i][0], corners[i][1]);
       }
       ctx.closePath();
       ctx.fill();
}

function loop() {
    
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (gameState == "startScreen") {
        startScreen();
    }
    else if (gameState == "play") {
        play();
    }
    else if (gameState == "settings") {
        settings();
    }
    else if (gameState == "credits") {
        credits();
    }
    else if (gameState == "game") {
        game();
    }
    else {
        console.log("game state error");
    }

    //console.log(keyPresses);

    window.requestAnimationFrame(loop);
}

function startScreen() {
    scrollQueue();

    if (keyPresses[menuControls.select]) {
        gameStateChange(startScreenOptions[currentOption]);
    }

    currentOption += keyPresses[menuControls.down] - keyPresses[menuControls.up];

    if (currentOption < 0) {
        currentOption = 0;
    }
    if (currentOption > startScreenOptions.length - 1) {
        currentOption = startScreenOptions.length - 1;
    }

    drawOptions(startScreenOptions);

}

function play() {
    scrollQueue();

    if (keyPresses[menuControls.back]) {
        gameStateChange("startScreen");
    }
    if (keyPresses[menuControls.select] && playOptions[currentOption] == "start") {
        gameStateChange("game");
    }
    if (playOptions[currentOption][0] == "map") {
        playOptions[currentOption][1] = listScroll(playOptions[currentOption][1], maps);
    }
    if (playOptions[currentOption][0] == "playerCount") {
        playOptions[currentOption][1] = slider(playOptions[currentOption][1], 1, 2);
    }
    if (playOptions[currentOption][0] == "player1Car" || playOptions[currentOption][0] == "player2Car") {
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
        gameStateChange("startScreen");
    }
    if (settingsOptions[currentOption][0] == "masterVolume" || settingsOptions[currentOption][0] == "musicVolume" || settingsOptions[currentOption][0] == "fXVolume") {
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
        gameStateChange("startScreen");
    }
    console.log("credits!!!");
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
    if (state == "startScreen") {
        gameState = "startScreen";
        keyPresses[menuControls.up] = false;
        keyPresses[menuControls.down] = false;
        keyPresses[menuControls.left] = false;
        keyPresses[menuControls.right] = false;
        keyPresses[menuControls.select] = false;
        keyPresses[menuControls.back] = false;
        currentOption = 0;
    }
    else if (state == "play") {
        gameState = "play";
        keyPresses[menuControls.up] = false;
        keyPresses[menuControls.down] = false;
        keyPresses[menuControls.left] = false;
        keyPresses[menuControls.right] = false;
        keyPresses[menuControls.select] = false;
        keyPresses[menuControls.back] = false;
        currentOption = 0;
    }
    else if (state == "settings") {
        gameState = "settings";
        keyPresses[menuControls.up] = false;
        keyPresses[menuControls.down] = false;
        keyPresses[menuControls.left] = false;
        keyPresses[menuControls.right] = false;
        keyPresses[menuControls.select] = false;
        keyPresses[menuControls.back] = false;
        currentOption = 0;
    }
    else if (state == "credits") {
        gameState = "credits";
        keyPresses[menuControls.back] = false;
    }
    
    else if (state == "game") {
        gameState = "game";
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
            new Player(WIDTH/(2*WORLDSCALE), HEIGHT/(2*WORLDSCALE), "ongelsk")
        ];
    }
    else {
        console.log("gameStateChange error");
    }
    console.log(gameState);
    console.log(keyPresses);
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
    ctx.font = "30px Monocraft";
    ctx.fillText(options[currentOption], 50, HEIGHT / 2);

    for (let i = 1; i < 5; i++) {
        if (options[currentOption + i]) {
            ctx.fillText(options[currentOption + i], 50, (HEIGHT / 2) + 40 * i);
        }
        if (options[currentOption - i]) {
            ctx.fillText(options[currentOption - i], 50, (HEIGHT / 2) + 40 * -i);
        }
    }
}
