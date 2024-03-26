let img;
var imgw;
var imgh;
let input;
let button;
let invbox;
let debbox;
let pixarray = [];
let brightarray = [];

let flock = [];

let debug = false;
let invert = false;
let amt = 500;
let separationstr = 20;
let imgstr = 15;

let img0;

function setup() {
    input = createFileInput(handleImage);
    input.attribute('accept', "image/*");
    invbox = createCheckbox('invert');
    debbox = createCheckbox('brain');
    button = createButton('save image');
    input.position(0, 0);
    invbox.position(0, 25);
    debbox.position(0, 45);
    button.position(0, 68);
    button.hide();


    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d", { 
        alpha: false,
        willReadFrequently: true
    });
    if (ctx.getContextAttributes) {
        const attributes = ctx.getContextAttributes();
        console.log(JSON.stringify(attributes));
    } else {
        console.log("CanvasRenderingContext2D.getContextAttributes() is not supported");
    }

    img0 = new Image();
    img0.src = "../assets/icons/cursor.png"
    noStroke();
    noSmooth();

    button.mousePressed(() => {
        save('cursorimg');
    });
}

// Create an image if the file is an image.
function handleImage(file) {
    if (file.type === 'image') {
        img = loadImage(file.data, 
                        function(){
                            pixarray = [];
                            brightarray = [];
                            flock = [];
                            imgUpdate();
                            resizeCanvas(imgw, imgh);
                            button.show();
                            image(img, 0, 0);
                            for (let i = 0; i < amt; i++) {
                                flock.push(new cursor(random(width), random(height)));
                            }
                        });
      }
}

function imgUpdate() {
    console.log("updating");
    let size = 700;
    let downscaling = 5;
    if (img.width > img.height) {
        img.resize(size, 0);
    } else {
        img.resize(0, size);
    }

    img.resize(int(img.width), int(img.height));
    imgw = img.width;
    imgh = img.height;
    img.resize(int(img.width/downscaling), int(img.height/downscaling));
    console.log(imgw, imgh);
    pixtoarray(img, pixarray);
}

function pixtoarray(img, array) {
    console.log("pixtoarray init");
    img.loadPixels();
    for(let i = 0; i < img.pixels.length; i += 4) {
        let b = brightness(color(img.pixels[i], img.pixels[i+1], img.pixels[i+2], 255));
        let pix = [img.pixels[i], img.pixels[i+1], img.pixels[i+2], 255];
        array.push(pix);
        brightarray.push(b);
    }
    console.log("pixtoarray done");
}

function draw() {
    if (invbox.checked()) {
        invert = true;
    } else {
        invert = false;
    }
    
    if (debbox.checked()) {
        debug = true;
    } else {
        debug = false;
    }

    background(255);
    if (invert) {
        background(0);
    }
    for (let i = 0; i < flock.length; i++) {
        flock[i].flock(flock);
        flock[i].update();
        flock[i].display();
    }
}

//-----------BOID CLASS-------------//

class cursor {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-1,1), random(-1,1));
        this.acc = createVector(0, 0);
        this.maxForce = 0.2;
        this.maxSpeed = 4;
    }
    
    edges() {
        if (this.pos.x > width-12) {
            this.pos.x = width-12;
            this.vel.x *= -1;
        } else if (this.pos.x < 0) {
            this.pos.x = 0;
            this.vel.x *= -1;
        }
        if (this.pos.y > height-19) {
            this.pos.y = height-19;
            this.vel.y *= -1;
        } else if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y *= -1;
        }
    }
    
    separation(boids) {
        let steering = createVector(0, 0);
        let total = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = p5.Vector.dist(this.pos, boids[i].pos);
            if (boids[i] != this && simpledist(this.pos.x, this.pos.y, boids[i].pos.x, boids[i].pos.y, separationstr)) {
                let diff = p5.Vector.sub(this.pos, boids[i].pos);
                diff.normalize();
                diff.div(d * d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.normalize();
            steering.mult(this.maxSpeed);
            steering.sub(this.vel);
            steering.limit(this.maxForce);
        }
        fill(10+total*20, 255-total*5, 0);
        return steering;
    }

    img() {
        let steering = createVector(0, 0);
        let total = 0;
        let pixel = createVector(0, 0);
        let avgb = 0;
        let area = [];
        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                if (simpledist(this.pos.x, this.pos.y, x*(width/img.width), y*(height/img.height), imgstr)) {
                    let newb = brightarray[x + y*img.width];
                    area.push(new p5.Vector(x*(width/img.width), y*(height/img.height), newb));
                    if (debug) {
                        fill(newb);
                        rect(x*(width/img.width), y*(height/img.height), (width/img.width), (height/img.height));
                    }
                    avgb += newb;
                    total++;
                }
            }
        }
        avgb /= total;
        total = 0;
        for (let i = 0; i < area.length; i++) {
            if (invert) {
                if (area[i].z >= avgb) {
                    pixel.x += area[i].x;
                    pixel.y += area[i].y;
                    total ++;
                }
            } else {
                if (area[i].z <= avgb) {
                    pixel.x += area[i].x;
                    pixel.y += area[i].y;
                    total ++;
                }
            }
        }
        pixel.x /= total;
        pixel.y /= total;
        if (debug) {
            fill(255, 0, 0);
            stroke(255, 0, 0);
            line(this.pos.x, this.pos.y, pixel.x, pixel.y);
            noStroke();
        }
        if (total > 0) {
            steering.x = map(pixel.x-this.pos.x, 0, width, 0, 1);
            steering.y = map(pixel.y-this.pos.y, 0, height, 0, 1);
            if (invert) {
                this.vel.mult(map(avgb, 0, 255, 1, 0.9));
            } else {
                this.vel.mult(map(avgb, 0, 255, 0.9, 1));
            }
        }
        return steering;
    }
    
    flock(boids) {
        this.acc.add(this.separation(boids).mult(0.12));
        this.acc.add(this.img().mult(1.5));
        this.edges();
    }
    
    update() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.acc.mult(0);
    }

    display() {
        drawingContext.drawImage(img0, this.pos.x, this.pos.y, img0.width, img0.height);
    }
}

function simpledist(x1, y1, x2, y2, threshold) {
    let a = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
    let b = threshold * threshold;
    return a < b;
}