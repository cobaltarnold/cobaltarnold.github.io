//empty img variable to be filled with user input
let img;
//variables to be used to resize the canvas to image dimensions
var imgw;
var imgh;
//user inputs
let input;
let button;
let button2;
//array to fill with pixel colors
let array = [];
let brightarray = [];

function setup() {
    //initilizing user inputs
    input = createFileInput(handleImage);
    button = createButton('process image');
    button2 = createButton('save image');
    input.position(0, 0);
    button.position(0, 20);
    button2.position(0, 40);
    button.hide();
    button2.hide();

    //make canvas and setup for multiple readback operations
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

    //process pixels on button press
    button.mousePressed(() => {
        process(pixarray);
    });

    button2.mousePressed(() => {
        save('imagename');
    });
}

// Create an image if the file is an image.
function handleImage(file) {
    if (file.type === 'image') {
        img = loadImage(file.data, 
                        function(){
                            //reset pixel array
                            pixarray = [];
                            imgUpdate();
                            resizeCanvas(imgw, imgh);
                            button.show();
                            button2.show();
                            image(img, 0, 0);
                        });
      }
}

//method to downscale image and update width/height values
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

//method to fill an array with the colors of each pixel of an image
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

}

//function where pixel array is manipulated
function process(array) {
    console.log("sorting");
    array.sort();

    console.log("rasterizing");
    arraytopix(img, array);

    image(img, 0, 0);
    console.log("done");
}

//method to assign array of colors to pixels of an image
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

//method to locate a 2d value in a 1d array
function index(x, y) {
  return x + y * width;
}