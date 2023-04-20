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

let gameState = "Menu";
let currentOption = 0;

let keyPresses = {};

let queue =  [];

let maps = [
    "Plains",
    "Fog",
    "City"
];

let cars = [
    "Cool car",
    "Lightning mc queen",
    "Block of cheese",
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

let menuOptions = [
    "Play",
    "Settings",
    "Credits"
];

let playOptions = [
    "Start",
    ["Map", maps[0]],
    ["Player Count", 1],
    ["Player 1 Car", cars[0]],
    ["player 2 Car", cars[0]],
];

let settingsOptions = [
    ["Master Volume", 50],
    ["Music Volume", 100],
    ["FX Volume", 100],
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

let creditsOptions = [
    ["Dev 1", "Gard"],
    ["Dev 2", "Liam"],
    ["Dev 3", "Oscar"]
];

gameStateChange("Menu");

document.onkeydown = function(event) {
    if (gameState == "Game") {
        keyPresses[event.key] = true;
    }
}

document.onkeyup = function(event) {
    if (gameState == "Game") {
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