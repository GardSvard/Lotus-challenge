'use strict';

function drawScreen() {

}

function drawMiniMap() {
    ctxMap.fillStyle = "green";
    ctxMap.fillRect(0, 0, WIDTH, HEIGHT);
    drawVectorRect(WIDTH/2, HEIGHT/2, new Vector(-playerList[0].directionVector.x, playerList[0].directionVector.y), [8*WORLDSCALE,5000*WORLDSCALE], "gray");
    playerList[0].drawToMiniMap();
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

       ctxMap.fillStyle = color;
       ctxMap.beginPath();
       ctxMap.moveTo(corners[3][0], corners[3][1]);
       for (let i = 0; i < corners.length; i++) {
           ctxMap.lineTo(corners[i][0], corners[i][1]);
       }
       ctxMap.closePath();
       ctxMap.fill();
}
