//empty img variable to be filled with user input
let img;
//variables to be used to resize the canvas to image dimensions
var imgw;
var imgh;
//user inputs
let input;
let box;
let slider;
let slidertext;
let button;
//array to fill with pixel colors
let pixarray = [];
let brightarray = [];

let circles = [];
let spacing     = 2;
let speed       = 1.5;
let initsize    = 0;
let bg = null;
let spread = 10;

function setup() {
    //initilizing user inputs
    input = createFileInput(handleImage);
    input.attribute('accept', "image/*");
    button = createButton('save image');
    slider = createSlider(1, 100, 10);
    slidertext = createDiv('mouse spread');
    box = createCheckbox('random');
    input.position(0, 0);
    slider.position(7, 25);
    slidertext.position(8, 45);
    box.position(0, 65);
    button.position(0, 90);
    button.hide();
    box.hide();
    slider.hide();
    slidertext.hide();

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

    slider.mouseReleased(() => {
        spread = slider.value();
    });

    button.mousePressed(() => {
        save('circledraw');
    });
}

// Create an image if the file is an image.
function handleImage(file) {
    if (file.type === 'image') {
        img = loadImage(file.data, 
                        function(){
                            //reset pixel array
                            pixarray = [];
                            brightarray = [];
                            circles = [];
                            imgUpdate();
                            resizeCanvas(imgw, imgh);
                            image(img, 0, 0);
                            box.show();
                            slider.show();
                            slidertext.show();
                            button.show();
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
    let red = 0;
    let green = 0;
    let blue = 0;
    img.loadPixels();
    for(let i = 0; i < img.pixels.length; i += 4) {
        let b = brightness(color(img.pixels[i], img.pixels[i+1], img.pixels[i+2], 255));
        let pix = [img.pixels[i], img.pixels[i+1], img.pixels[i+2]];
        red += img.pixels[i];
        green += img.pixels[i+1];
        blue += img.pixels[i+2];
        array.push(pix);
        brightarray.push(b);
    }
    red /= img.pixels.length/4;
    green /= img.pixels.length/4;
    blue /= img.pixels.length/4;
    bg = color(red, green, blue);
    console.log("pixtoarray done");
}

function draw() {
    if(bg) {
        background(bg);
    }
  
    let newC = null;
    if(mouseIsPressed && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        let x = constrain(mouseX + random(-spread, spread), 0, width-1);
        let y = constrain(mouseY + random(-spread, spread), 0, height-1);
        newC = newCircle(x, y);
    }

    if (newC != null) {
        circles.push(newC);
    }

    if (box.checked()) {
        for (let i = 0; i < 30; i++) {
            newC = newCircle(random(spacing, width-spacing), random(spacing, height-spacing));
            if (newC != null) {
                circles.push(newC);
            }
        }
    } 
    
    if(img) {
        for (let c of circles) {
            if (c.growing) {
            if (c.edges()) {
                c.growing = false;
            } else {
                for (let other of circles) {
                if (other != c) {
                    let d = dist(c.x, c.y, other.x, other.y);
                    if (d-spacing-initsize < c.r + other.r) {
                    c.growing = false;
                    break;
                    }
                }
                }
            }
            }
            c.show();
            c.grow();
        }
    }
}

function newCircle(x, y) {
    let valid = true;
    for (let c of circles) {
        let d = dist(x, y, c.x, c.y);
        if (d-spacing-initsize < c.r) {
            valid = false;
            break;
        }
    }
    
    if (valid) {
        return new Circle(x, y);
    } else {
        return null;
    }
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
        img.pixels[i*4 + 3] = 255;
    }
    img.updatePixels();
}

//method to locate a 2d value in a 1d array
function index(x, y) {
  return x + y * width;
}

//-------------CIRCLE CLASS--------------//
class Circle {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = initsize;
        this.growing = true;
    }
    
    grow() {
      if (this.growing) {
        this.r += speed;
      }
    }
    
    edges() {
        return (this.x+this.r > width-spacing 
             || this.x-this.r < spacing 
             || this.y+this.r > height-spacing 
             || this.y-this.r < spacing);
    }
    
    show() {
        noStroke();
        //console.log(this.x, this.y, this.r);
        let red = (pixarray[index(int(this.x), int(this.y))][0] + 
                    pixarray[index(int(this.x+this.r), int(this.y))][0] +  
                    pixarray[index(int(this.x), int(this.y+this.r))][0] + 
                    pixarray[index(int(this.x-this.r), int(this.y))][0] + 
                    pixarray[index(int(this.x), int(this.y-this.r))][0]) / 5;
        let green = (pixarray[index(int(this.x), int(this.y))][1] +
                    pixarray[index(int(this.x+this.r), int(this.y))][1] + 
                    pixarray[index(int(this.x), int(this.y+this.r))][1] +
                    pixarray[index(int(this.x-this.r), int(this.y))][1] +
                    pixarray[index(int(this.x), int(this.y-this.r))][1]) / 5;
        let blue = (pixarray[index(int(this.x), int(this.y))][2] +
                    pixarray[index(int(this.x+this.r), int(this.y))][2] +
                    pixarray[index(int(this.x), int(this.y+this.r))][2] +
                    pixarray[index(int(this.x-this.r), int(this.y))][2] +
                    pixarray[index(int(this.x), int(this.y-this.r))][2]) / 5;
        let fincol = color(int(red), int(green), int(blue));
        //console.log(red, green, blue);
        fill(fincol);
        ellipse(this.x, this.y, this.r*2, this.r*2);
    }
  }