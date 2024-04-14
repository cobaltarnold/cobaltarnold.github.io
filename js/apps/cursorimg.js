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
let invbox;
let debbox;
let inputs;
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
    dropzone = select('#dropzone');
    dropzone.dragOver(highlight);
    dropzone.dragLeave(unhighlight);
    dropzone.drop(handleImage, unhighlight);
    dropzone.attribute('accept', "image/*");
    input = createFileInput(handleImage);
    input.attribute('accept', "image/*");
    input.style('color', 'transparent');
    input.parent(dropzone);

    invbox = createCheckbox('invert');
    debbox = createCheckbox('brain');
    inputs = select('.inputs');
    invbox.parent(inputs);
    debbox.parent(inputs);
    button = createButton('Save Image');
    button.parent(inputs);
    button.id('button2');

    if (isMobile) {
        input.style('margin-bottom: 1rem');
        button.html("Start Processing");
    } else {
        p = createP('or drag and drop it here.');
        p.parent(dropzone);
    }

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