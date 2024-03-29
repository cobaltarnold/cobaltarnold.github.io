let flock = [];

let amt = 100;
let separationstr = 30;
let alignmentstr = 25;
let cohesionstr = 50;
let mwheel = 0;

let img0;
let img1;
let img2;
let img3;
let img4;
let images = [];

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight/1.2);
  img0 = new Image();
  img0.src = "assets/icons/bar.png"
  images.push(img0);
  img1 = new Image();
  img1.src = "assets/icons/cursor.png"
  images.push(img1);
  img2 = new Image();
  img2.src = "assets/icons/hourglass.png"
  images.push(img2);
  img3 = new Image();
  img3.src = "assets/icons/move.png"
  images.push(img3);
  img4 = new Image();
  img4.src = "assets/icons/pointer.png"
  images.push(img4);
  frameRate(30);
  for (let i = 0; i < 5; i++) {
    flock.push([]);
    for (let j = 0; j < int(amt/5); j++) {
      flock[i].push(new cursor(random(width), random(height)));
    }
  }
  noStroke();
  noSmooth();
}

function draw() {
  background(0);
  for (let i = 0; i < flock.length; i++) {
    for (let j = 0; j < flock[i].length; j++) {
      flock[i][j].flock(flock, i);
      flock[i][j].update();
      flock[i][j].display(i);
    }
  }
}

class cursor {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1,1), random(-1,1));
    this.acc = createVector(0, 0);
    this.maxForce = 0.2;
    this.maxSpeed = 4;
  }
  
  edges(i) {
    let steering = createVector(0, 0);
    if (this.pos.x > width - images[i].width) {
      this.pos.x = width - images[i].width;
      steering.x = -1;
      return steering;
    } else if (this.pos.x < 0) {
      this.pos.x = 0;
      steering.x = 1;
      return steering;
    }
    if (this.pos.y > height - images[i].height) {
      this.pos.y = height - images[i].height;
      steering.y = -1;
      return steering;
    } else if (this.pos.y < 0) {
      this.pos.y = 0;
      steering.y = 1;
      return steering;
    }
    return steering;
  }
  
  align(boids, i) {
    let steering = createVector(0, 0);
    let total = 0;
    for (let j = 0; j < boids[i].length; j++) {
      let d = p5.Vector.dist(this.pos, boids[i][j].pos);
      if (boids[i][j] != this && d < alignmentstr) {
        steering.add(boids[i][j].vel);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }
    return steering;
  }
  
  separation(boids) {
    let steering = createVector(0, 0);
    let total = 0;
    for (let i = 0; i < boids.length; i++) {
      for (let j = 0; j < boids[i].length; j++) {
        let d = p5.Vector.dist(this.pos, boids[i][j].pos);
        if (boids[i][j] != this && d < separationstr) {
          let diff = p5.Vector.sub(this.pos, boids[i][j].pos);
          diff.normalize();
          diff.div(d * d);
          steering.add(diff);
          total++;
        }
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
  
  cohesion(boids, i) {
    let steering = createVector(0, 0);
    let total = 0;
    for (let j = 0; j < boids[i].length; j++) {
      let d = p5.Vector.dist(this.pos, boids[i][j].pos);
      if (boids[i][j] != this && d < cohesionstr) {
        steering.add(boids[i][j].pos);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.pos);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }
    return steering;
  }
  
  mouse() {
    let steering = createVector(0, 0);
    steering.x = map(mouseX-this.pos.x, 0, windowWidth, 0, 1);
    steering.y = map(mouseY-this.pos.y, 0, windowHeight, 0, 1);
    return steering;
  }
  
  flock(boids, i) {
    this.acc.add(this.align(boids, i).mult(1.7));
    this.acc.add(this.cohesion(boids, i).mult(1.4));
    this.acc.add(this.separation(boids).mult(1.9));
    // if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    //   this.acc.add(this.mouse().mult(0.5));
    // }
    this.acc.add(this.edges(i).mult(1.5));
  }
  
  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.acc.mult(0);
  }

  display(j) {
    drawingContext.drawImage(images[j], this.pos.x, this.pos.y, images[j].width, images[j].height);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight/1.2);
}

const about = document.getElementById("about");
const cursorarray = [];
cursorarray.push('alias', 'cell', 'col-resize', 'copy', 'crosshair', 'e-resize', 'grab', 'grabbing', 'help', 'move', 'n-resize', 'ne-resize', 'nw-resize', 'no-drop', 'pointer', 'progress', 'row-resize', 'text', 'url', 'w-resize', 'wait', 'zoom-in', 'zoom-out');
var to;
var cursorswap = function() {
  let n = random(0, cursorarray.length);
  n = Math.round(n);
  $("#about").css("cursor", cursorarray[n]);
}

var i = 0;
const anim = [];
anim.push('grabbing', 'grab', 'cell', 'crosshair', 'col-resize', 'row-resize', 'n-resize', 'ne-resize', 'w-resize', 'nw-resize', 'n-resize', 'ne-resize', 'w-resize', 'nw-resize', 'pointer');
var cursoranim = function() {
  if (i > anim.length) {
    $("#about").css("cursor", "pointer");
  }
  $("#about").css("cursor", anim[i]);
  console.log(i, anim.length);
  i++;
}

$(document).ready(function(){
  $('#about').hover(function(e) {
    to = window.setInterval(cursoranim, 100);
  },function(e) {
    i = 0;
    window.clearInterval(to);
  });
});