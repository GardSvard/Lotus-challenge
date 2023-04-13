'use strict';

class Player extends Car {
    constructor(x, y,
            spriteSheet, size = 5,
            speed = 0, directionVector = new Vector(0, -30),
            accelerationTop = 5, accelerationTop2 = accelerationTop ** 2,
            drawTopDown = false) {

        super(x, y, size, 
            spriteSheet,
            speed, directionVector,
            accelerationTop, accelerationTop2);
        
        this.x = x;
        this.y = y;

        this.brakeForce = 10;
        this.drawTopDown = drawTopDown; //draws top down info if true
        this.mapSize = [2 * WORLDSCALE, 4 * WORLDSCALE]; //2 * 4 meters on screen
        this.impulseVector = new Vector(0,0);
        this.controlDict = {
            turnLeft    : 'a',
            turnRight   : 'd',
            goForwards  : 'w',
            goBackwards : 's'
        }
    }

    //draws car as black rectangle with a line pointing up at all times
    drawToMiniMap() {
        ctx.fillStyle = "black";
        ctx.fillRect(WIDTH / 2 - this.mapSize[0] / 2, HEIGHT / 2 - this.mapSize[1] / 2, this.mapSize[0], this.mapSize[1]);
    }    

    update() {

        //code for inertial impulse after a crash
        this.x += this.impulseVector.x*HZ;
        this.y += this.impulseVector.y*HZ;

        let impulseStop = 2;
        this.impulseVector.scale(0.8);
        if (this.impulseVector.length < impulseStop)

        if (this.speed > 0) { //prevents turning if car is stationary
            let turn = (
                keyPresses[this.controlDict.turnRight] - 
                keyPresses[this.controlDict.turnLeft]
            )*Math.PI/100;
            // console.log(keyPresses[this.controlDict.turnLeft])
            this.directionVector.rotate2d(turn);
        }

        let acc = (
            keyPresses[this.controlDict.goForwards] 
        )*this.acceleration(this.speed);
        
        this.speed += acc;

        if (keyPresses[this.controlDict.goBackwards]) {
            this.speed -= this.deceleration();
        }
        
        preOutput.innerHTML = this.speed;
        preOutput.innerHTML += "\nx: " + Math.round(this.x*100)/100 + "\ty: " + Math.round(this.y*100)/100;

        let velocityVector = Vector.normalize(this.directionVector);
        velocityVector.scale(this.speed);
        
        this.x += velocityVector.x*HZ;
        this.y += velocityVector.y*HZ;
    }

    acceleration(speed) {
        //f(x) = sqrt(acceleration^2 - (x/10)^2)
        let temp = this.accelerationTop2 - (speed/12)**2;
        if (temp > 0) {
            return Math.sqrt(temp)*HZ;
        } else {return 0;}
    }

    deceleration() {
        if (this.speed - this.brakeForce*HZ < 0) {
            return this.speed;
        } else {return this.brakeForce*HZ;}
    }
}