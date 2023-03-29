'use strict';

let canvasGfx = document.getElementById("canvasGfx");
let canvasMap = document.getElementById("canvasMap");
let preOutput = document.getElementById("preOutput");
let buttonRun = document.getElementById("buttonRun");
let buttonReset = document.getElementById("buttonReset");

let ctx = canvasGfx.getContext("2d");
ctx.imageSmoothingEnabled = false; //turns off antialiasing

let ctxMap = canvasMap.getContext("2d");

const WIDTH = ctx.canvas.width;
const HEIGHT = ctx.canvas.height;

const WORLDSCALE = 5;
const FPS = 60;
const HZ = 1/FPS; 

let playerList = [
    new Player(0, 0, "ongelsk")
];

let keyPresses = {
    'Escape' : false
};

for (let i = 0; i < playerList.length; i++) {
    keyPresses[playerList[i].controlDict.turnLeft] = false;
    keyPresses[playerList[i].controlDict.turnRight] = false;
    keyPresses[playerList[i].controlDict.goForwards] = false;
    keyPresses[playerList[i].controlDict.goBackwards] = false;
}

document.onkeydown = function(event) {
    // console.log(event.key);
    keyPresses[event.key] = true;
}

document.onkeyup = function(event) {
    keyPresses[event.key] = false;
}

function update() {
    for (let i = 0; i < playerList.length; i++) {
        playerList[i].update();
    }
    bezColl.updatePassed(new Vector(playerList[0].x, playerList[0].y));

    drawScreen();
    drawMiniMap();
}

function loop() {
    if (buttonPressed == true) { //pause under the game window
        update();
    }

    window.requestAnimationFrame(loop);
}

buttonRun.onclick = function () {
    if (buttonPressed == false) {
        buttonPressed = true;
        buttonRun.innerHTML = "Stop";
        if (started == false) {
            started = true;
            window.requestAnimationFrame(loop);
        }
    } else {
        buttonPressed = false;
        buttonRun.innerHTML = "Start";
    }
}

buttonReset.onclick = function() {reset();}

let started = false;
let buttonPressed = false;
// reset();

let p1 = new Vector(0, 0);
let p2 = new Vector(0, -5);
let p3 = new Vector(0, -10);
let p4 = new Vector(0, -15);
let bez = new CubicBezier(p1, p2, p3, p4, 15);

let bezColl = new BezierCurveCollection(bez);