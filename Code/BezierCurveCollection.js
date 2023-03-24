'use strict'

class BezierCurveCollection {

    cubicBezList;
    scale;
    currentLastIndex;
    renderDist;
    maxTheta;
    passedCurrent;
    pointScalar;

    constructor(curve1) {
        this.cubicBezList = [curve1];
        this.currentLastIndex = 0;
        this.renderDist = 3;
        this.maxTheta = 1.5;
        this.passedCurrent = false;
        this.scale=curve1.scale;
        this.pointScalar = 15;
        for (let i=0; i<this.renderDist; i++) {
            this.nextSection();
        }
        this.currentLastIndex = this.renderDist-1;
    }

    renderCurrent() {
        // ctx.clearRect(0, 0, WIDTH, HEIGHT);
        for (let x = 0; x < this.renderDist; x++) {
            let i = x+(this.cubicBezList.length-1-(this.renderDist));
            let bez = this.cubicBezList[i];
            bez.drawCurve();
            bez.drawConrolPoints();
        }
    }

    addSection() {
        let lastBez = this.cubicBezList[this.cubicBezList.length-1];
        let lastBezC = lastBez.C;
        let lastBezD = lastBez.D;
        let CDVector = Vector.subtract(lastBezD, lastBezC);

        let newA = Vector.copyVector(lastBezD);
        let newB = Vector.add(lastBezD, CDVector);

        let randThetaC = Math.random()*2*this.maxTheta-this.maxTheta;
        let newC = Vector.add(newB, (Vector.rotate2d(CDVector, randThetaC)));
        
        let randThetaD = Math.random()*2*this.maxTheta-this.maxTheta;
        let newD = Vector.add(newC, (Vector.rotate2d(CDVector, randThetaD)));

        let nextCurve = new CubicBezier(newA, newB, newC, newD, this.scale);
        this.cubicBezList.push(nextCurve);
        //this.cubicBezList.shift();
    }

    nextSection(draw=false) {
        this.addSection();
        this.currentLastIndex++;

        if (draw) {
            this.renderCurrent();
        }
    }

    approxDistToCurrent(P, sampleSize=5) {

        let minDist = this.cubicBezList[(this.cubicBezList.length-1-(this.renderDist))].approxDist(P, sampleSize);
        for (let x = 1; x < this.renderDist; x++) {
            let i = x+(this.cubicBezList.length-1-(this.renderDist));
            let dist = this.cubicBezList[i].approxDist(P, sampleSize);
            minDist = Math.min(minDist, dist);
        }

        return(minDist);
    }

    getPointTangents(sampleSize=10, draw=false) {
        let tangentsObjList = [];

        for (let x = 0; x < this.renderDist; x++) {
            let i = x+(this.cubicBezList.length-1-(this.renderDist));
            let bez = this.cubicBezList[i];
            for (let m = 0; m<sampleSize; m++) {
                let t = m/sampleSize;
                let P = bez.getPoint(t);
                P.scale(this.pointScalar); //scales up the points for smoother and bigger road
                let tangent = bez.getTangent(t, draw);
                let tangentObject = {
                    point: P, 
                    tangent: tangent
                };
                tangentsObjList.push(tangentObject);
            }
        }
        
        return(tangentsObjList);
    }

    updatePassed(position) {
        let currentBez = this.cubicBezList[this.cubicBezList.length-1-this.renderDist];
        if (currentBez.hasPassed(position) != this.passedCurrent) {
            this.nextSection();
            this.passedCurrent = currentBez.hasPassed(position);
        }
    }

}


let p1 = new Vector(0, 0);
let p2 = new Vector(0, -5);
let p3 = new Vector(0, -10);
let p4 = new Vector(0, -15);
let bez = new CubicBezier(p1, p2, p3, p4, 15);


// const ctx = document.getElementById("canvasGfx").getContext("2d");
// const WIDTH = ctx.canvas.width;
// const HEIGHT = ctx.canvas.height;

let bezColl = new BezierCurveCollection(bez);


// let P = new Vector(0, 2);
// console.log(bezColl.approxDistToCurrent(P));

// bezColl.renderCurrent();
// bez.drawCurve();
// bez.drawConrolPoints();

//console.log(bezColl.getPointTangents(5));