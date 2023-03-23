'use strict'

class CubicBezier {

    A;
    B;
    C;
    D;
    scale;

    constructor(A, B, C, D, scale=1) {
        this.A = A;
        this.B = B;
        this.C = C;
        this.D = D;
        this.scale = scale;
    }

    getPoint(t, draw = false) {
        // let P =     (-this.A+3*this.B-3*this.C+this.D)*Math.pow(t, 3)
        //             + (3*this.A-6*this.B+3*this.C)*Math.pow(t, 2)
        //             + (-3*this.A+3*this.B)*t
        //             + (this.A);

        
        let P = Vector.addMultiple([
                                    (Vector.scale(Math.pow(t, 3), Vector.addMultiple([Vector.scale(-1, this.A), Vector.scale(3, this.B), Vector.scale(-3, this.C), Vector.copyVector(this.D)]))),
                                    (Vector.scale(Math.pow(t, 2), Vector.addMultiple([Vector.scale(3, this.A), Vector.scale(-6, this.B), Vector.scale(3, this.C)]))),
                                    (Vector.scale(t, Vector.addMultiple([Vector.scale(-3, this.A), Vector.scale(3, this.B)]))),
                                    (Vector.copyVector(this.A))
                                    ])

        if (draw) {
            ctx.fillStyle = "RED";
            ctx.beginPath();
            ctx.arc((P.x*this.scale)+(WIDTH/4), (P.y*this.scale)+(HEIGHT/2), 2, 0, 2*Math.PI);
            ctx.fill();
        }
        return(P)
    }

    getTangent(t, draw = false) {
        // let P =     (-this.A+3*this.B-3*this.C+this.D)*Math.pow(t, 3)
        //             + (3*this.A-6*this.B+3*this.C)*Math.pow(t, 2)
        //             + (-3*this.A+3*this.B)*t
        //             + (this.A);

        
        let tangent = Vector.scale(0.3, Vector.addMultiple([
                                    (Vector.scale((3*Math.pow(t, 2)), Vector.addMultiple([Vector.scale(-1, this.A), Vector.scale(3, this.B), Vector.scale(-3, this.C), Vector.copyVector(this.D)]))),
                                    (Vector.scale((2*t), Vector.addMultiple([Vector.scale(3, this.A), Vector.scale(-6, this.B), Vector.scale(3, this.C)]))),
                                    (Vector.addMultiple([Vector.scale(-3, this.A), Vector.scale(3, this.B)]))
                                    ]))

        if (draw) {
            console.log(tangent);
            let startP = Vector.subtract(this.getPoint(t), tangent);
            let endP = Vector.add(this.getPoint(t), tangent);

            ctx.strokeStyle = "GREEN";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(WIDTH/4+startP.x*this.scale, HEIGHT/2+startP.y*this.scale);
            ctx.lineTo(WIDTH/4+endP.x*this.scale, HEIGHT/2+endP.y*this.scale);
            ctx.stroke();
        }
        return(tangent);
    }


    drawCurve() {
        for (let t =0; t<=1; t+=0.01) {
            this.getPoint(t, true);
        }

    }

    drawConrolPoints() {
        ctx.fillStyle = "BLACK";
        ctx.beginPath();
        ctx.arc((this.A.x*this.scale)+(WIDTH/4), (this.A.y*this.scale)+(HEIGHT/2), 5, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc((this.B.x*this.scale)+(WIDTH/4), (this.B.y*this.scale)+(HEIGHT/2), 5, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc((this.C.x*this.scale)+(WIDTH/4), (this.C.y*this.scale)+(HEIGHT/2), 5, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc((this.D.x*this.scale)+(WIDTH/4), (this.D.y*this.scale)+(HEIGHT/2), 5, 0, 2*Math.PI);
        ctx.fill();
    }

    approxDist(P, sampleSize=5) {
        let minDist = Vector.subtract(this.getPoint(0), P).length;
        for (let i = 1; i <= sampleSize; i++) {
            let t = i/sampleSize;
            let dist =  Vector.subtract(this.getPoint(t), P).length;
            minDist = Math.min(minDist, dist);
        }
        return(minDist);
    }
}

// let p1 = new Vector(1, 1);
// let p2 = new Vector(2, 3);
// let p3 = new Vector(3, 3);
// let p4 = new Vector(4, 2);
// let bez = new CubicBezier(p1, p2, p3, p4);


// const ctx = document.getElementById("canvasGfx").getContext("2d");

// bez.drawCurve(ctx);
// bez.drawConrolPoints(ctx);