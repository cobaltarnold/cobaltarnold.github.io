let img;
var imgw;
var imgh;
let input;
let button;
let slider;
let pixarray = [];

let boxes = [];
let threshold = 60;
let minsize = 5;
let attempts = 0;
let attemptlim = 1000;

function setup() {
    input = createFileInput(handleImage);
    button = createButton('process image');
    slider = createSlider(1, 75, 55);
    input.position(0, 0);
    button.position(0, 20);
    slider.position(7, 45);
    slider.size(255);
    button.hide();
    slider.hide();

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
    background(0);
    noFill();
    stroke(0);
    strokeWeight(1);

    button.mousePressed(() => {
        process(pixarray);
    });

}

function process(array) {
    attempts = 0;
    initboxes();
    console.log("sorting");
    threshold = slider.value();
    console.log("threshold is "+threshold);

    while(attempts < attemptlim) {
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].update();
            boxes[i].display();
        }
    }

    if (attempts > attemptlim) {
        background(255);
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].display();
        }
        noLoop();
    }

    console.log("done");
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
            test = brightness(pixarray[index(i, j)]);
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

// Create an image if the file is an image.
function handleImage(file) {
    if (file.type === 'image') {
        img = loadImage(file.data, 
                        function(){
                            pixarray = [];
                            attempts = 0;
                            imgUpdate();
                            resizeCanvas(imgw, imgh);
                            button.show();
                            slider.show();
                            image(img, 0, 0);
                        });
      }
}

function imgUpdate() {
    console.log("updating");
    if (img.width > img.height) {
        if (img.width > 1000) {
            img.resize(1000, 0);
        } if (img.height > 1000) {
            img.resize(0, 1000);
        }
    } else {
        if (img.width > 1000) {
            img.resize(1000, 0);
        } if (img.height > 1000) {
            img.resize(0, 1000);
        }
    }

    img.resize(int(img.width), int(img.height));
    imgw = img.width;
    imgh = img.height;
    console.log(imgw, imgh);
    pixtoarray(img, pixarray);
}

function pixtoarray(img, array) {
    console.log("pixtoarray init");
    img.loadPixels();
    for(let i = 0; i < img.pixels.length; i += 4) {
        let col = color(img.pixels[i], img.pixels[i+1], img.pixels[i+2]);
        array.push(col);
    }
    console.log(img.pixels.length, array.length);
    console.log("pixtoarray done");

    initboxes();
}

function initboxes() {
    boxes = [];
    if(imgh > imgw) {
        boxes.push(new Box(0, 0, imgh));
        let size = imgh;
        let x = 0;
        while (size > 1) {
            if (x + size < imgw) {
                for (let y = 0; y < imgh; y += size) {
                    boxes.push(new Box(x, y, size));
                }
            }
            x += size;
            if (x > imgw) {
                x -= size;
            } 
            size /= 2;
        }
        boxes.shift();
    } else {
        boxes.push(new Box(0, 0, imgw));
        let size = imgw;
        let y = 0;
        while (size > 1) {
            if (y + size < imgh) {
                for (let x = 0; x < imgw; x += size) {
                    boxes.push(new Box(x, y, size));
                }
            }
            y += size;
            if (y > imgh) {
                y -= size;
            } 
            size /= 2;
        }
        boxes.shift();
    }
}

function index(x, y) {
  return x + y * width;
}