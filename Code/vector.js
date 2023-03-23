
class Vector {

    #x;
    #y;
    #z;
    #polar;

    constructor(x, y, z = null, polar = false) {
        //x becomes length with polar coordinates, while y becomes rotation
        //in the xy plane, and z becomes rotation in that plane

        this.#polar = polar;
        if (!polar) {
            this.#x = x;
            this.#y = y;
            this.#z = z;
        }
        
        else {
            let len;
            if (z != null) {
                len = x*Math.cos(z);
            } else len = x;

            this.#x = len*Math.cos(y);
            this.#y = len*Math.sin(y);
            if (z != null) {
                this.#z = x*Math.sin(z);
            }
        }
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }
    
    get z() {
        return this.#z;
    }

    get polar() {
        return this.#polar;
    }

    get dimension() {
        let d = 2;
        if (this.z != null) d++;
        return d;
    }

    get length() { //three dimensional length, returns 2 dimensional if only two dimensions are given
        let l = Math.sqrt(this.x**2 + this.y**2 + this.z**2);
        return l;
    }

    get length2() { //two dimensional length for when three are given
        let l = Math.sqrt(this.x**2 + this.y**2);
        return l;
    }

    get angle() { //angle in xy plane
        return Math.atan2(this.x, this.y);
    }

    get angle3D() { //angle between z and xy plane
        return Math.atan2(this.length2, this.z);
    }

    static length(x, y, z = null) { //three dimensional length, returns 2 dimensional if only two dimensions are given
        let l = Math.sqrt(Math.sqrt(x**2 + y**2)**2 + z**2);
        return l;
    }

    static angle(x, y) { //angle in xy plane
        return Math.atan2(x, y);
    }

    static angle3D(x, y, z) { //angle between z and xy plane
        return Math.atan2(Vector.length(x, y), z);
    }

    //D3 = 3D, if its a 3D vector
    static randomVectorCoordinates(length = 1, D3 = false) {
        let x = Math.random();
        let y = Math.random();
        let z = null;
        if (D3) {
            z = Math.random();
        }
        let len = Vector.length(x, y, z);
        x *= length/len;
        y *= length/len;
        z *= length/len;
        return x, y, z;
    }

    //D3 = 3D, if its a 3D vector
    static randomVector(length = 1, D3 = false) {
        let x = Math.random();
        let y = Math.random();
        let z = null;
        if (D3) {
            z = Math.random();
        }
        let len = Vector.length(x, y, z);
        x *= length/len;
        y *= length/len;
        z *= length/len;
        return new Vector(x, y, z);
    }

    toPolar() {
        let len = this.length;
        let angle2D = this.angle;
        if (this.z != null) {
            return len, angle2D, this.angle3D;
        } else return len, angle2D;
    }

    static toPolar(x, y, z = null) {
        let len = Vector.length(x, y);
        let angle2D = Vector.angle(x, y);
        if (z != null) {
            return len, angle2D, Vector.angle3D(x, y, z);
        } else return len, angle2D;
    }

    toString() {
        let s = "[" + this.x + ", " + this.y;
        if (this.z != null) s += ", " + this.z;
        s += "]";
        return s;
    }

    static toString(x, y, z = null) {
        let s = "[" + x + ", " + y;
        if (z != null) s += ", " + z;
        s += "]";
        return s;
    }

    static copy(vector) {
        return new Vector(vector.x, vector.y, vector.z);
    }

    static addMultiple(vList) {
        let v1 = vList[0];
        let nV = Vector.copyVector(v1);
        for (let i=1; i<vList.length; i++) {
            v1.add(vList[i]);
        }
        return(v1);
    }

    static copyVector(vector) {
        return new Vector(vector.x, vector.y, vector.z);
    }

    static add(left, right) {
        let x = left.x + right.x;
        let y = left.y + right.y;
        if (left.dimension != right.dimension) {
            throw "The vectors you are trying to add do not have the same dimensions";
        } else if (left.dimension == 3) {
            let z = left.z + right.z;
            return new Vector(x, y, z);
        } else return new Vector(x, y);
    }

    static dotProduct(left, right) {
        if (left.dimension != right.dimension) {
            throw "The vectors you are trying to take the dot product of do not have the same dimensions";
        }
        let p = left.x*right.x + left.y*right.y + left.z*right.z;
        return p;
    }

    add(vector) {
        this.#x += vector.x;
        this.#y += vector.y;
        if (this.dimension != vector.dimension) {
            throw "The vectors you are trying to add do not have the same dimensions";
        } else if (this.dimension == 3) this.#z += vector.z;
    }

    static subtract(left, right) {
        let x = left.x - right.x;
        let y = left.y - right.y;
        if (left.dimension != right.dimension) {
            throw "The vectors you are trying to subtract do not have the same dimensions";
        } else if (left.dimension == 3) {
            let z = left.z - right.z;
            return new Vector(x, y, z);
        } else return new Vector(x, y);
    }

    subtract(vector) {
        this.#x -= vector.x;
        this.#y -= vector.y;
        if (this.dimension != vector.dimension) {
            throw "The vectors you are trying to subtract do not have the same dimensions";
        } else if (this.dimension == 3) this.#z -= vector.z;
    }
    
    scale(scalar) {
        let x = this.x*scalar;
        this.#x = x;
        let y = this.y*scalar;
        this.#y = y;
        if (this.z != null) {
            let z = this.z*scalar;
            this.#z = z;
        }
    }

    static scale(scalar, vector) {
        let x = vector.x*scalar;
        let y = vector.y*scalar;
        if (vector.z != null) {
            let z = vector.z*scalar;
            return(new Vector(x, y, z));
        }
        return(new Vector(x, y))
    }

    divide(dividend) {
        let x = this.x/dividend;
        this.#x = x;
        let y = this.y/dividend;
        this.#y = y;
        if (this.z != null) {
            let z = this.z/dividend;
            this.#z = z;
        }
    }

    normalize() {
        let len = this.length;
        this.#x /= len;
        this.#y /= len;
        if (this.z != null) {
            let z = this.z/dividend;
            this.#z = z;
        }
    }

    mirrorX() {
        this.#x = -this.x;
    }

    static mirrorX(vector) {
        return new Vector(-vector.x, vector.y);
    }

    static normalize(vector) {
        let len = vector.length;
        if (vector.dimension == 3) {
            return new Vector(
                vector.x/len, 
                vector.y/len, 
                vector.z/len
                );
        } else {
            return new Vector(
                vector.x/len, 
                vector.y/len
                );
        }
    }

    rotate2d(theta) { //tar en liste med koordinater
        let x = this.x;
        let y = this.y;
        this.#x = x*Math.cos(theta) - y*Math.sin(theta);
        this.#y = x*Math.sin(theta) + y*Math.cos(theta);
    }

    static rotate2d(vector, theta) { //tar en liste med koordinater
        let nx = vector.x*Math.cos(theta) - vector.y*Math.sin(theta);
        let ny = vector.x*Math.sin(theta) + vector.y*Math.cos(theta);
        let newVector = new Vector(nx, ny);
        return newVector;
    }

    angleDiff2d(vector) {
        let diff = this.angle - vector.angle;
        if (Math.abs(diff) > Math.PI) {
            diff = Math.PI*2 - diff;
        }
        return diff;
    }
    
    static angleDiff2d(vector1, vector2) {
        let diff = vector1.angle - vector2.angle;
        if (Math.abs(diff) > Math.PI) {
            diff = Math.PI*2 - diff;
        }
        return diff;
    }

}