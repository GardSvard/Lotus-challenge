'use strict';

class Player extends Car {
    constructor(x, y, size, spriteSheet, speed, directionVector, accelerationTop, accelerationTop2, drawTopDown = false) {
        super(x, y, size, spriteSheet, speed, directionVector, accelerationTop, accelerationTop2);
        
        this.x = x;
        this.y = y;
        this.speed = 0;
        this.directionVector = new Vector(0, -30);
        this.accelerationTop = 5;
        this.accelerationTop2 = this.accelerationTop ** 2;
        this.brakeForce = 10;
        this.drawTopDown = drawTopDown; //draws top down info if true
        this.mapSize = [2 * WORLDSCALE, 4 * WORLDSCALE]; //2 * 4 meters on screen
        this.controlDict = {
            turnLeft    : 'a',
            turnRight   : 'd',
            goForwards  : 'w',
            goBackwards : 's'
        }
    }

    //draws car as black rectangle with a line pointing up at all times
    drawToMiniMap() {
        ctxMap.fillStyle = "black";
        ctxMap.fillRect(WIDTH / 2 - this.mapSize[0] / 2, HEIGHT / 2 - this.mapSize[1] / 2, this.mapSize[0], this.mapSize[1]);
        ctxMap.beginPath();
        ctxMap.moveTo(WIDTH / 2, HEIGHT / 2);
        ctxMap.lineTo(WIDTH / 2 - this.directionVector.x * this.speed, HEIGHT / 2 - this.directionVector.y * this.speed);
        ctxMap.stroke();
        ctxMap.closePath();
    }    
}