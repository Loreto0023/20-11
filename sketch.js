let font;
let tSize = 150;///Text Size
let tposX = 50;//// X position of text
let tposY = 500;//// Y position of text
let pointCount = 0.9;//// between 0 - 1 // point count

let speed = 10;///speed of the particles
let comebackSpeed = 100;//// lower the number less interaction
let dia = 50;///diameter of interaction
let randomPos = true;////starting points
let pointsDirection = "general";///left right up down general 
let interactionDirection = -1;//// -1 and 1

let textPoints = [];

function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  tposX = width/2 -
  tposY = height/2


  textFont(font);

  let points = font.textToPoints("menu", tposX, tposY, tSize, {
    sampleFactor: pointCount,
  });

  for (let i = 0; i < points.length; i++) {
    let pt = points[i];

    let textPoint = new Interact(
      pt.x,
      pt.y,
      speed,
      dia,
      randomPos,
      comebackSpeed,
      pointsDirection,
      interactionDirection
    );
    textPoints.push(textPoint);
  }
}

function draw() {
  background(0);

  for (let i = 0; i < textPoints.length; i++) {
    let v = textPoints[i];
    v.update();
    v.show();
    v.behaviors();
  }
}

function Interact(x, y, m, d, t, s, di, p) {
    if (t) {
        this.home = createVector(random(width), random(height));
    } else {
        this.home = createVector(x, y);
    }
    this.pos = this.home.copy();
    this.target = createVector(x, y);

    if (di == "general") {
        this.vel = createVector();
    } else if (di == "up") {
        this.vel = createVector(0, -y);
    } else if (di == "down") {
        this.vel = createVector(0, y);
    } else if (di == "left") {
        this.vel = createVector(-x, 0);
    } else if (di == "right") {
        this.vel = createVector(x, 0);
    }


    this.acc = createVector();
    this.r = 8;
    this.maxSpeed = m;
    this.maxforce = 1
    this.dia = d
    this.come = s
    this.dir = p
}

Interact.prototype.behaviors = function () {
    let arrive = this.arrive(this.target);
    let mouse = createVector(mouseX, mouseY)
    let flee = this.flee(mouse)

    this.applyForce(arrive)
    this.applyForce(flee)
}

Interact.prototype.applyForce = function (f) {
    this.acc.add(f);

}

Interact.prototype.arrive = function (target) {
    let desired = p5.Vector.sub(target, this.pos)
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < this.come) {
        speed = map(d, 0, this.come, 0, this.maxSpeed)

    }
    desired.setMag(speed)
    let steer = p5.Vector.sub(desired, this.vel)
    return steer
}


Interact.prototype.flee = function (target) {
    let desired = p5.Vector.sub(target, this.pos)
    let d = desired.mag()

    if (d < this.dia) {
        desired.setMag(this.maxSpeed)
        desired.mult(this.dir)
        let steer = p5.Vector.sub(desired, this.vel)
        steer.limit(this.maxForce)
        return steer
    } else {
        return createVector(0, 0)
    }

}

Interact.prototype.update = function () {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0)
}

Interact.prototype.show = function () {
    stroke(255)
    strokeWeight(4)
    point(this.pos.x, this.pos.y)
}
