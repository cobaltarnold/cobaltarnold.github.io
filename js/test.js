let boxes = [];
let threshold = 60;
let minsize = 5;
let attempts = 0;
let attemptlim = 100;
let img;
var imgw;
var imgh;
let input;
let pixarray = [];

function setup() {
    input = createFileInput(handleImage);
    canvas = createCanvas(640, 480); //nice boxes if a power of two
    input.position(0, 0);
    background(0);
    noFill();
    stroke(0);
    strokeWeight(1);
}

function draw() {
    if(img) {
        image(img, 0, 0);
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].update();
            boxes[i].display();
        }
        if (attempts > attemptlim) {
            background(255);
            for (let i = 0; i < boxes.length; i++) {
                boxes[i].display();
            }
            noLoop();
        }
    }
}

class Box {
    constructor(x, y, s) {
        this.pos = createVector();
        this.pos.x = x;
        this.pos.y = y;
        this.size = s;
    }
    
    display() {
        rect(this.pos.x, this.pos.y, this.size, this.size);
    }
    
    update() {
      if (this.size > minsize) {
        if (pixbrightness(this.pos.x, this.pos.y, this.size) < threshold) {
            bsplit(this);
            attempts = 0;
        } else {
            attempts++;
        }
      }
    }
}
  
function pixbrightness(x, y, s) {
    let darkest = 255;
    let test = 0;
    for (let i = int(x); i < int(x)+int(s); i++) {
        for (let j = int(y); j < int(y)+int(s); j++) {
            test = brightness(pixarray[i+j*img.width]);
            if (test < darkest) {
                darkest = test;
            }
        }
    }
    return darkest;
}

function bsplit(b) {
    b.size = b.size/2;
    boxes.push(new Box(b.pos.x + b.size, b.pos.y, b.size));
    boxes.push(new Box(b.pos.x, b.pos.y + b.size, b.size));
    boxes.push(new Box(b.pos.x + b.size, b.pos.y + b.size, b.size));
}


function pixtoarray(img, array) {
    img.loadPixels();
    for(let i = 0; i < img.pixels.length; i += 4) {
        let col = color(img.pixels[i], img.pixels[i+1], img.pixels[i+2]);
        array.push(col);
    }
}


// Create an image if the file is an image.
function handleImage(file) {
    if (file.type === 'image') {
        img = loadImage(file.data, 
                        function(){
                          imgUpdate();
                          resizeCanvas(imgw, imgh);
                        });
      }
}

function imgUpdate() {
    image(img, 0, 0);
    imgw = img.width;
    imgh = img.height;

    pixtoarray(img, pixarray);

    boxes.push(new Box(0, 0, imgh));
    let s = imgh;
    let c = 0;
    while (s > 1) {
        if (c + s < imgw) {
            for (let i = 0; i < imgh; i += s) {
                boxes.push(new Box(c, i, s));
            }
        }
        c += s;
        if (c > imgw) {
            c-= s;
        } 
        s /= 2;
    }
}