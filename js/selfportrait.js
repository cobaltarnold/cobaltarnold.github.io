var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var parent = document.getElementById("selfportrait");
canvas.width = parent.offsetWidth;
canvas.height = parent.offsetHeight;

var cx = canvas.width/2;
var cy = canvas.height/2;

let boxsize = canvas.height/3;
var x = boxsize*-1;
var y = boxsize*-1;
var w = boxsize;
var h = boxsize;
var deg = 0;


canvas.addEventListener('mousemove', function(e) {
    var mouse = getMouse(e, canvas);
    cx = mouse.x;
    cy = mouse.y;
    redraw(mouse);
}, false);

canvas.addEventListener("wheel", (e) => {
    getDegrees(e.deltaY);
    var mouse = getMouse(e, canvas);
    redraw(mouse);
});

function clear() {
    ctx.save();
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.restore();
}

function redraw(mouse) {
    clear();

    canvas.width = canvas.width;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.translate(cx, cy); // pivot point
    ctx.rotate(deg * Math.PI/180); // rotate square in radians
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(y, w);
    ctx.lineTo(w, h);
    ctx.lineTo(h, x);
    ctx.closePath();
    ctx.clip();

    ctx.rotate(deg * Math.PI/180*-1); // rotate square in radians
    ctx.translate(-cx, -cy); // pivot point
    let n = degtoimg(deg);
    ctx.drawImage(imgarray[n], 0, 0, canvas.width, canvas.height);

    ctx.restore();
}

function getDegrees(theta) {
    deg += theta;
    clear();
}

function degtoimg(d) {
    d = Math.abs(d);
    while (d > 180) {
        d -= 180;
    }
    d /= 180;
    d *= 15;
    d = Math.round(d);
    return d;
}

let img = new Image(canvas.width, canvas.height);
img.src = "../assets/work/myself/me0.png";

var imgarray = new Array();
imgarray[0] = new Image(canvas.width, canvas.height);
imgarray[0].src = "../assets/work/myself/me1.png";
imgarray[1] = new Image(canvas.width, canvas.height);
imgarray[1].src = "../assets/work/myself/me2.png";
imgarray[2] = new Image(canvas.width, canvas.height);
imgarray[2].src = "../assets/work/myself/me3.png";
imgarray[3] = new Image(canvas.width, canvas.height);
imgarray[3].src = "../assets/work/myself/me4.png";
imgarray[4] = new Image(canvas.width, canvas.height);
imgarray[4].src = "../assets/work/myself/me5.png";
imgarray[5] = new Image(canvas.width, canvas.height);
imgarray[5].src = "../assets/work/myself/me6.png";
imgarray[6] = new Image(canvas.width, canvas.height);
imgarray[6].src = "../assets/work/myself/me7.png";
imgarray[7] = new Image(canvas.width, canvas.height);
imgarray[7].src = "../assets/work/myself/me8.png";
imgarray[8] = new Image(canvas.width, canvas.height);
imgarray[8].src = "../assets/work/myself/me9.png";
imgarray[9] = new Image(canvas.width, canvas.height);
imgarray[9].src = "../assets/work/myself/me8.png";
imgarray[10] = new Image(canvas.width, canvas.height);
imgarray[10].src = "../assets/work/myself/me7.png";
imgarray[11] = new Image(canvas.width, canvas.height);
imgarray[11].src = "../assets/work/myself/me6.png";
imgarray[12] = new Image(canvas.width, canvas.height);
imgarray[12].src = "../assets/work/myself/me5.png";
imgarray[13] = new Image(canvas.width, canvas.height);
imgarray[13].src = "../assets/work/myself/me4.png";
imgarray[14] = new Image(canvas.width, canvas.height);
imgarray[14].src = "../assets/work/myself/me3.png";
imgarray[15] = new Image(canvas.width, canvas.height);
imgarray[15].src = "../assets/work/myself/me2.png";


function getMouse(e, canvas) {
    var element = canvas,
        offsetX = 0,
        offsetY = 0,
        mx, my;

    if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        mx = touch.pageX;
        my = touch.pageY;
    } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
        mx = e.clientX;
        my = e.clientY;
    } 
    
    // Compute the total offset. It's possible to cache this if you want
    // if (element.offsetParent !== undefined) {
    //     do {
    //         offsetX += element.offsetLeft;
    //         offsetY += element.offsetTop;
    //     } while ((element = element.offsetParent));
    // }

    // mx = e.pageX - offsetX;
    // my = e.pageY - offsetY;

    // We return a simple javascript object with x and y defined
    return {
        x: mx,
        y: my
    };
}

addEventListener("resize", (e) => {
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    boxsize = canvas.height/3;
    x = boxsize*-1;
    y = boxsize*-1;
    w = boxsize;
    h = boxsize;
});