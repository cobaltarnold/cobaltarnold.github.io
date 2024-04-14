var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
    console.log('mobile');
}

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
let brightarray = [];

let boxes = [];
let threshold = 55;
let minsize = 5;
let attempts = 0;
let attemptlim = 1000;

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
    noSmooth();
    stroke(0);
    strokeWeight(1);

    button.mousePressed(() => {
        process();
    });

    button2.mousePressed(() => {
        save('boxsplit');
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

function draw() {
    if (isMobile) {
        console.log('e');
        threshold = slider.value();
        slidertext.html("Threshold: "+threshold);
    }
}

function process() {
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
            test = brightarray[index(i, j)];
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
                            input.attribute('title', file.name);
                            brightarray = [];
                            attempts = 0;
                            imgUpdate();
                            resizeCanvas(imgw, imgh);
                            button.show();
                            button2.show();
                            slider.show();
                            slidertext.show();
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
    pixtoarray(img, brightarray);
}

function pixtoarray(img, array) {
    console.log("pixtoarray init");
    img.loadPixels();
    for(let i = 0; i < img.pixels.length; i += 4) {
        let b = brightness(color(img.pixels[i], img.pixels[i+1], img.pixels[i+2], 255));
        brightarray.push(b);
    }
    console.log("pixtoarray done");

    initboxes();
}

function initboxes() {
    boxes = [];
    if(imgh > imgw) {
        boxes.push(new Box(0, 0, imgh));
        let size = imgh;
        let x = 0;
        while (size >= 1) {
            if (x + size <= imgw) {
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
        while (size >= 1) {
            if (y + size <= imgh) {
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