let img;
var imgw;
var imgh;
var dropzone;
let p;
let input;
let button;
let button2;
let slider;
let slidertext;
let pixarray = [];
let brightarray = [];

let threshold = 55;

function setup() {
    dropzone = select('#dropzone');
    dropzone.dragOver(highlight);
    dropzone.dragLeave(unhighlight);
    dropzone.drop(handleImage, unhighlight);
    dropzone.attribute('accept', "image/*");
    input = createFileInput(handleImage);
    input.attribute('accept', "image/*");
    input.style('color', 'transparent');
    input.parent(dropzone);
    p = createP('or drag and drop it here.');
    p.parent(dropzone);
    
    button = select('#button');
    button2 = select('#button2');
    slider = select('#slider');
    slidertext = select('#slidertext');
    button.hide();
    slider.hide();
    slidertext.hide();
    button2.hide();

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
    noSmooth();

    var counter;
    button.mousePressed(() => {
        counter = setInterval(function() {
            process(pixarray);
        }, 30);
    });

    button.mouseReleased(() => {
        clearInterval(counter);
    });

    ["mousedown", "touchstart"].forEach(event => {
        button.addEventListener(event, () => {
            counter= setInterval(
                process(pixarray)
            , 30);
        });
    });
    ["mouseup", "touchend"].forEach(event => {
        button.addEventListener(event, () => {
            clearInterval(counter);
        });
    });

    button2.mousePressed(() => {
        img.save('pixelfall');
    });

    slider.mouseMoved(() => {
        threshold = slider.value();
        slidertext.html("Threshold: "+threshold);
    });

    slider.mouseReleased(() => {
        threshold = slider.value();
        slidertext.html("Threshold: "+threshold);
    });
}

function highlight() {
    dropzone.style("background-color", "#00f1");
}

function unhighlight() {
    dropzone.style("background-color", "none");
}

// Create an image if the file is an image.
function handleImage(file) {
    if (file.type === 'image') {
        img = loadImage(file.data, 
                        function(){
                            input.attribute('title', file.name);
                            pixarray = [];
                            brightarray = [];
                            imgUpdate();
                            resizeCanvas(imgw, imgh);
                            button.show();
                            slider.show();
                            slidertext.show();
                            button2.show();
                            image(img, 0, 0);
                        });
      }
}

function imgUpdate() {
    console.log("updating");
    let size = 1000;
    if (img.width < img.height) {
        if (img.width > size) {
            img.resize(size, 0);
        } if (img.height > size) {
            img.resize(0, size);
        }
    } else {
        if (img.height > size) {
            img.resize(size, 0);
        } if (img.width > size) {
            img.resize(0, size);
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
        let b = brightness(color(img.pixels[i], img.pixels[i+1], img.pixels[i+2], 255));
        let pix = [img.pixels[i], img.pixels[i+1], img.pixels[i+2], 255];
        array.push(pix);
        brightarray.push(b);
    }
    console.log("pixtoarray done");
}

function process(array) {
    for (let x = 0; x < imgw; x++) {
        for (let y = 0; y < imgh-1; y++) {
            if (brightarray[index(x, y)] <= threshold) {  //if pixel is under threshold
                if (!(brightarray[index(x, y+1)] <= threshold)) {  //if pixel below is not under threshold
                    let stored = array[index(x, y+1)];
                    array[index(x, y+1)] = array[index(x, y)];
                    array[index(x, y)] = stored;

                    let bstored = brightarray[index(x, y+1)];
                    brightarray[index(x, y+1)] = brightarray[index(x, y)];
                    brightarray[index(x, y)] = bstored;
                }
            }
        }
    }
    arraytopix(img, array);
    image(img, 0, 0);
}

function arraytopix(img, array) {
    img.loadPixels();
    for(let i = 0; i < array.length; i += 1) {
        // Red.
        img.pixels[i*4] = array[i][0];
        // Green.
        img.pixels[i*4 + 1] = array[i][1];
        // Blue.
        img.pixels[i*4 + 2] = array[i][2];
        // Alpha.
        img.pixels[i*4 + 3] = array[i][3];
    }
    img.updatePixels();
}

function index(x, y) {
  return x + y * width;
}