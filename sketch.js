let font;
let tSize = 150; // Text Size
let pointCount = 0.9; // Between 0 - 1 (point count)
let speed = 10; // Speed of the particles
let comebackSpeed = 100; // Lower means less interaction
let dia = 50; // Diameter of interaction
let randomPos = true; // Starting points
let pointsDirection = "general"; // Movement direction: left, right, up, down, general
let interactionDirection = -1; // Interaction direction: -1 and 1

let textPoints = [];
let tposX, tposY; // Text position

function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Ensure canvas size follows window size

  // Initialize text position
  setTextPosition();

  textFont(font);

  // Generate points from the text 'Cat'
  let points = font.textToPoints("Cat", tposX, tposY, tSize, {
    sampleFactor: pointCount,
  });

  // Create Interact objects for each point, adjust their positions relative to window size
  for (let i = 0; i < points.length; i++) {
    let pt = points[i];

    // Calculate relative position of each point based on window size
    let relativeX = pt.x / width;
    let relativeY = pt.y / height;

    // Adjust the particle position to be relative to window size
    let textPoint = new Interact(
      relativeX * width,
      relativeY * height,
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

  // Update and display each text point (particle)
  for (let i = 0; i < textPoints.length; i++) {
    let v = textPoints[i];
    v.update();
    v.show();
    v.behaviors();
  }
}

function setTextPosition() {
  // Calculate the position of the text relative to window size (center the text)
  tposX = width / 2 - tSize * 0.8;
  tposY = height / 2 + tSize / 6;
}

function Interact(x, y, m, d, t, s, di, p) {
  // If randomPos is true, start the particles at random positions
  if (t) {
    this.home = createVector(random(width), random(height));
  } else {
    this.home = createVector(x, y); // Otherwise, use the text position
  }

  // Store current position and set target position to home
  this.pos = this.home.copy();
  this.target = createVector(x, y);

  // Set the velocity based on the movement direction
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

  // Acceleration, radius, max speed, and force values
  this.acc = createVector();
  this.r = 8;
  this.maxSpeed = m;
  this.maxforce = 1;
  this.dia = d;
  this.come = s;
  this.dir = p;
}

Interact.prototype.behaviors = function () {
  let arrive = this.arrive(this.target); // Arrive at target
  let mouse = createVector(mouseX, mouseY); // Mouse position
  let flee = this.flee(mouse); // Flee from mouse if close

  // Apply forces to the particle (arrive + flee)
  this.applyForce(arrive);
  this.applyForce(flee);
}

Interact.prototype.applyForce = function (f) {
  this.acc.add(f);
}

Interact.prototype.arrive = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  let speed = this.maxSpeed;
  if (d < this.come) {
    speed = map(d, 0, this.come, 0, this.maxSpeed);
  }
  desired.setMag(speed);
  let steer = p5.Vector.sub(desired, this.vel);
  return steer;
}

Interact.prototype.flee = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();

  // If the mouse is within the interaction diameter, the particle flees
  if (d < this.dia) {
    desired.setMag(this.maxSpeed);
    desired.mult(this.dir); // Use interaction direction
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0); // No force if the mouse is too far
  }
}

Interact.prototype.update = function () {
  this.pos.add(this.vel); // Update position based on velocity
  this.vel.add(this.acc); // Update velocity based on acceleration
  this.acc.mult(0); // Reset acceleration for the next frame
}

Interact.prototype.show = function () {
  stroke(255);
  strokeWeight(4);
  point(this.pos.x, this.pos.y); // Draw the particle as a point
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize the canvas
  setTextPosition(); // Recalculate text position
  textPoints = []; // Clear existing particles
  // Regenerate particles based on new window size
  let points = font.textToPoints("Cat", tposX, tposY, tSize, {
    sampleFactor: pointCount,
  });

  // Recreate Interact objects for each point with positions relative to new window size
  for (let i = 0; i < points.length; i++) {
    let pt = points[i];

    // Calculate relative position of each point based on window size
    let relativeX = pt.x / width;
    let relativeY = pt.y / height;

    // Adjust the particle position to be relative to window size
    let textPoint = new Interact(
      relativeX * width,
      relativeY * height,
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
