'use strict';

function drawScreen() {
    //draws the main screen
    let background = {
        image : new Image()
    }
    background.image.src = "./spriteSheets/backgroundDay.png";

    ctx.drawImage(background.image, 0, 0);

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

    let renderDistance = 250; //100 meters
    let roadSegmentLength = 15; //everything is given in meters
    let roadSegmentWidth = 8;

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

    if (gameState == "Menu") {
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
        gameStateChange("Menu");
    }
    if (keyPresses[menuControls.select] && playOptions[currentOption] == "Start") {
        gameStateChange("Game");
    }
    if (playOptions[currentOption][0] == "Map") {
        playOptions[currentOption][1] = listScroll(playOptions[currentOption][1], maps);
    }
    if (playOptions[currentOption][0] == "Player Count") {
        playOptions[currentOption][1] = slider(playOptions[currentOption][1], 1, 2);
    }
    if (playOptions[currentOption][0] == "Player 1 Car" || playOptions[currentOption][0] == "Player 2 Car") {
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
        gameStateChange("Menu");
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
        gameStateChange("Menu");
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
    if (state == "Menu") {
        gameState = "Menu";
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
            new Player(WIDTH/(2*WORLDSCALE), HEIGHT/(2*WORLDSCALE), "ongelsk")
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

    ctx.strokeRect(40, HEIGHT / 2 - 35, 350, 45);
    ctx.font = "70px Monocraft";

    ctx.fillText(gameState, 50, 300)

    ctx.font = "30px Monocraft"

    if (options[currentOption].length != 2) {
        ctx.fillText(options[currentOption], 50, HEIGHT / 2);
    }
    else {
        ctx.fillText(options[currentOption][0], 50, HEIGHT / 2);
        ctx.fillText(options[currentOption][1], 400, HEIGHT / 2);
    }
    for (let i = 1; i < 10; i++) {
        if (options[currentOption + i]) {
            if (options[currentOption + i].length != 2) {
                ctx.fillText(options[currentOption + i], 50, (HEIGHT / 2) + 40 * i);
            }
            else {
                ctx.fillText(options[currentOption + i][0], 50, (HEIGHT / 2) + 40 * i);
                ctx.fillText(options[currentOption + i][1], 400, (HEIGHT / 2) + 40 * i);
            }
        }
    }
    if (options[currentOption - 1]) {
        if (options[currentOption - 1].length != 2) {
            ctx.fillText(options[currentOption - 1], 50, (HEIGHT / 2) - 40);
        }
        else {
            ctx.fillText(options[currentOption - 1][0], 50, (HEIGHT / 2) - 40);
            ctx.fillText(options[currentOption - 1][1], 400, (HEIGHT / 2) - 40);
        }
    }
}
