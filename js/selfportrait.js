window.addEventListener('load', function(){
if (isMobileTablet()) {
    $("#request").addClass("shown");
}
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
                alert("motion activated");
                window.addEventListener( "deviceorientation", handleOrientation, true);
            }
        })
            .catch( console.error )
    } else {
        alert( "DeviceMotionEvent is not defined" );
    }
    $("#request").removeClass("shown");
}
const btn = document.getElementById( "request" );
btn.addEventListener( "click", permission );

function isMobileTablet(){
    var check = false;
    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
            check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function handleOrientation(event) {
    var a = event.alpha;
    let limit = 20;
    if (a < limit*-1) {
        a = limit*-1;
    } else if (a > limit) {
        a = limit;
    }
  
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