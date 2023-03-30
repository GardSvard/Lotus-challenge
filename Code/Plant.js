'use strict'

class Plant {
    position;
    size;
    color;

    constructor(position) {
        this.position = position;
        this.size = 1+Math.random()*6;

        let r = toString(Math.random*100);
        let g = toString(120+Math.random()*100);
        let b = toString(Math.random*100);
        this.color = 'rgb('+r+g+b+')';
    }
}