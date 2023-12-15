window.addEventListener('load', function(){
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

var startx;
var starty;

canvas.addEventListener('mousemove', function(e) {
    var mouse = getMouse(e, canvas);
    cx = mouse.x;
    cy = mouse.y;
    redraw();
}, false);

canvas.addEventListener('touchstart', function(e){
    var offset = getOffset(e, canvas);
    var touchobj = e.changedTouches[0] // reference first touch point (ie: first finger)
    cx = parseInt(touchobj.clientX) - offset.x// get x position of touch point relative to left edge of browser
    cy = parseInt(touchobj.clientY) - offset.y// get x position of touch point relative to left edge of browser
    startx = cx;
    starty = cy;
    startTime = new Date().getTime() // record time when finger first makes contact with surface
    e.preventDefault()
    redraw();
}, false);

canvas.addEventListener('touchmove', function(e){
    var offset = getOffset(e, canvas);
    var touchobj = e.changedTouches[0] // reference first touch point for this event
    cx = parseInt(touchobj.clientX) - offset.x
    cy = parseInt(touchobj.clientY) - offset.y
    e.preventDefault()
    redraw();
}, false);

canvas.addEventListener('touchend', function(e){
    var offset = getOffset(e, canvas);
    var touchobj = e.changedTouches[0] // reference first touch point (ie: first finger)
    if (startx == parseInt(touchobj.clientX) - offset.x && starty == parseInt(touchobj.clientY) - offset.y) {
        $(".info#z").addClass("shown");
        $(".infobg").addClass("shown");
        $("html, body").css("overflow-y", "hidden");
        $("html, body").css("margin-right", "8px");
        $("html, body").css("background", "gray");
    }
    e.preventDefault()
}, false);

function permission () {
    if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
        // (optional) Do something before API request prompt.
        DeviceMotionEvent.requestPermission()
            .then( response => {
            // (optional) Do something after API prompt dismissed.
            if ( response == "granted" ) {
                window.addEventListener( "deviceorientation", handleOrientation, true);
            }
        })
            .catch( console.error )
    } else {
        alert( "DeviceMotionEvent is not defined" );
    }
}

function handleOrientation(event) {
    permission();
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
  
    getDegrees(event.alpha);
    redraw();
}

canvas.addEventListener("wheel", (e) => {
    getDegrees(e.deltaY);
    redraw();
});

function clear() {
    ctx.save();
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.restore();
}

function redraw() {
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

    // Compute the total offset. It's possible to cache this if you want
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object with x and y defined
    return {
        x: mx,
        y: my
    };
}

function getOffset(e, canvas) {
    var element = canvas,
        offsetX = 0,
        offsetY = 0

    // Compute the total offset. It's possible to cache this if you want
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    // We return a simple javascript object with x and y defined
    return {
        x: offsetX,
        y: offsetY
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

}, false)