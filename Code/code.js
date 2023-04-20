"use strict";

//init variables

const canvasGFX = document.getElementById("canvasGFX");
const ctx = canvasGFX.getContext("2d");
ctx.imageSmoothingEnabled = false; //turns off antialiasing

let ctxMap = canvasMap.getContext("2d");

const WORLDSCALE = 5; //scales up from meters to pixels, lower number, more zoomed out
const FPS = 60;
const HZ = 1/FPS; 
const FOV = 90;
const FOVradians = (FOV/180)*Math.PI;

const WIDTH = ctxMap.canvas.width;
const HEIGHT = ctxMap.canvas.height;

const GAMEHEIGHT = ctx.canvas.height = 450;
const GAMEWIDTH = ctx.canvas.width = 800;

    let aspectRatio = GAMEWIDTH/GAMEHEIGHT;
    let cameraPosition = {
        x: 0,
        y: -5,
        z: 0
    };
    const cameraDepth = Math.abs(cameraPosition.y);
    const screenWidth = 
        Math.tan(FOVradians/2)*
        cameraDepth
    ;
    const screenHeight = 
        screenWidth/aspectRatio
    ;


let renderDistance = 250; //100 meters
let roadSegmentLength = 15; //everything is given in meters
let roadSegmentWidth = 8;
const pointScalar = 15;

let playerList = [];

let gameState = "startScreen";
let currentOption = 0;

let keyPresses = {};

let queue =  [];

let maps = [
    "plains",
    "fog",
    "city"
];

let cars = [
    "car1",
    "car2",
    "car3",
];

let menuControls = {
    up: "w",
    down: "s",
    left: "a",
    right: "d",
    select: "Enter",
    back: "Escape"
};

let gameControls  = {
    pause: "Escape",
    p1Accelerate: "w",
    p1Decelerate: "s",
    p1Left: "a",
    p1Right: "d",
    p1Shift: "Shift",
    p2Accelerate: "ArrowUp",
    p2Decelerate: "ArrowDown",
    p2Left: "ArrowLeft",
    p2Right: "ArrowRight",
    p2Shift: "."
}

let startScreenOptions = [
    "play",
    "settings",
    "credits"
];

let playOptions = [
    "start",
    ["map", maps[0]],
    ["playerCount", 1],
    ["player1Car", "car1"],
    ["player2Car", "car1"],
];

let settingsOptions = [
    ["masterVolume", 50],
    ["musicVolume", 100],
    ["fXVolume", 100],
    // ["player1Accelerate", "w"],
    // ["player1Decelerate", "s"],
    // ["player1Left", "a"],
    // ["player1Right", "d"],
    // ["player1Shift", "Shift"],
    // ["player2Accelerate", "ArrowUp"],
    // ["player2Decelerate", "ArrowDown"],
    // ["player2Left", "ArrowLeft"],
    // ["player2Right", "ArrowRight"],
    // ["player2Shift", " "]
];

let creditsValues = [
    ["dev1", "gard"],
    ["dev2", "liam"],
    ["dev3", "oscar"]
];

gameStateChange("startScreen");

document.onkeydown = function(event) {
    if (gameState == "game") {
        keyPresses[event.key] = true;
    }
}

document.onkeyup = function(event) {
    if (gameState == "game") {
        keyPresses[event.key] = false;
    }
    else {
        queue.push(event.key);
        queue.push(event.key);
    }
}



let p1 = new Vector(0, 0);
let p2 = new Vector(0, -5);
let p3 = new Vector(0, -10);
let p4 = new Vector(0, -15);
let bez = new CubicBezier(p1, p2, p3, p4, 15);

let bezColl = new BezierCurveCollection(bez);

loop();