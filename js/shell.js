let img;
var imgw;
var imgh;
let input;
let button;
let pixarray = [];

function setup() {
    input = createFileInput(handleImage);
    button = createButton('process image');
    input.position(0, 0);
    button.position(0, 20);
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
    background(0);
    noFill();
    stroke(0);
    strokeWeight(1);

    button.mousePressed(() => {
        process(pixarray);
    });
}

// Create an image if the file is an image.
function handleImage(file) {
    if (file.type === 'image') {
        img = loadImage(file.data, 
                        function(){
                            pixarray = [];
                            imgUpdate();
                            resizeCanvas(imgw, imgh);
                            button.show();
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
    console.log("pixtoarray done");
}

function draw() {

}

function process(array) {
    console.log("sorting");
    array.sort();
    console.log("rasterizing");
    arraytopix(img, array);
    image(img, 0, 0);
    console.log("done");
}

function arraytopix(img, array) {
    img.loadPixels();
    for(let i = 0; i < array.length; i += 1) {
        // Red.
        img.pixels[i*4] = red(array[i]);
        // Green.
        img.pixels[i*4 + 1] = green(array[i]);
        // Blue.
        img.pixels[i*4 + 2] = blue(array[i]);
        // Alpha.
        img.pixels[i*4 + 3] = 255;
    }
    img.updatePixels();
}

function index(x, y) {
  return x + y * width;
}