"use strict";

class Car extends Object{
    constructor(x, y, size, spriteSheet, speed, directionVector, accelerationTop, accelerationTop2) {
        super(x, y, size, spriteSheet);
        
        this.speed = speed;
        this.directionVector = directionVector;
        this.accelerationTop = accelerationTop;
        this.accelerationTop2 = accelerationTop2;
    }

    jump() {
        //if collision & obstacle is jumpable: car go ^^^^
    }

    update() {
        //turn depending on hotkey input
        if (this.speed > 0) { //prevents turning if car is stationary
            let turn = (keyPresses[this.controlDict.turnRight] - keyPresses[this.controlDict.turnLeft]) * Math.PI / 60;
            this.directionVector.rotate2d(turn);
        }

        //accelerate depending on hotkey input
        let acc = keyPresses[this.controlDict.goForwards] * this.acceleration(this.speed);
        
        this.speed += acc;

        //decelerate depending on hotkey input, temporary because car currently stays in motion for ever
        this.speed -= keyPresses[this.controlDict.goBackwards] * this.deceleration();
        
        //Vector.normalize turns a vector into a unit vector (length 1)
        let velocityVector = Vector.normalize(this.directionVector);
        velocityVector.scale(this.speed);
        
        this.x += velocityVector.x;
        this.y += velocityVector.y;

        //values for debugging
        preOutput.innerHTML = this.speed;
        preOutput.innerHTML += "\nx: " + this.x + "\ty: " + this.y;
    }

    //the acceleration equation will later be swapped out with multiple equations to simulate shifting
    acceleration(speed) {
        //f(x) = sqrt(acceleration^2 - (x/6)^2)
        let temp = this.accelerationTop2 - (speed/6)**2;
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