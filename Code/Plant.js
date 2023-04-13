'use strict'

class Plant {
    color;
    axiom;
    rules;

    constructor(rules, angle) {
        let r = toString(Math.random*50);
        let g = toString(120+Math.random()*100);
        let b = toString(Math.random*50);
        this.color = 'rgb('+r+g+b+')';

        this.axiom = 'X';
        this.rules = rules;
        this.angle = angle*Math.PI/180;
    }

    randomGreen() {
        let color;
        let r = (Math.random()*30).toString();
        let g = (80+Math.random()*100).toString();
        let b = (Math.random()*50).toString();
        color = 'rgb('+r+', '+g+', '+b+')'
        console.log(color);
        return(color);
    }

    randomBrown() {
        let r = toString(Math.random*50);
        let g = toString(120+Math.random()*100);
        let b = toString(Math.random*50);
        return('rgb('+r+g+b+')');
    }

    cycle(inputStr) {
        let outputStr = '';

        for (let i = 0; i<inputStr.length; i++) {
            let currentChar = inputStr[i];
            for (const [key, value] of Object.entries(this.rules)) {
                if (key==currentChar) {
                    currentChar = value;
                }
            }

            outputStr = outputStr.concat(currentChar);
        }

        return(outputStr);
    }
    
    cycleMultiple(inputStr, iterations) {
        let outputStr = inputStr;

        for (let i=0; i<iterations; i++) {
            outputStr = this.cycle(outputStr);
        }
        
        return(outputStr);
    }

    drawBranchStack(str, pos, vec) {
        let inputStr = str;
        let directonStack = [Vector.copyVector(vec)];
        let positionStack = [Vector.copyVector(pos)];
        for (let i = 0; i<inputStr.length; i++) {
            let currentChar = inputStr[i];
            if ((currentChar == 'F')) {
                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.strokeStyle = "rgb(69, 36, 17)";
                ctx.moveTo(positionStack[positionStack.length-1].x, positionStack[positionStack.length-1].y);
                positionStack[positionStack.length-1].add(directonStack[directonStack.length-1]);
                ctx.lineTo(positionStack[positionStack.length-1].x, positionStack[positionStack.length-1].y);
                ctx.stroke();
            } else if ((currentChar == '+')) {
                directonStack[directonStack.length-1].rotate2d(this.angle);
            } else if ((currentChar == '-')) {
                directonStack[directonStack.length-1].rotate2d(-this.angle);
            } else if ((currentChar == '[')) {
                positionStack.push(Vector.copyVector(positionStack[positionStack.length-1]));
                directonStack.push(Vector.copyVector(directonStack[directonStack.length-1]));
            } else if ((currentChar == ']')) {
                ctx.fillStyle = 'rgb(36, 106, 34)';
                ctx.beginPath();
                ctx.arc(positionStack[positionStack.length-1].x, positionStack[positionStack.length-1].y, 4, 0, 2 * Math.PI);
                ctx.fill();  
                positionStack.pop();
                directonStack.pop();
            }
        }
    }
}

const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let P = new Plant   ({
                        "X": "F-[[X]+X]+F[+FX]-X",
                        "F": "FF"
                    },
                    25);

let txt = (P.cycleMultiple("X", 6));
P.drawBranchStack(txt, new Vector(WIDTH/4, HEIGHT/2), new Vector(3, 0));