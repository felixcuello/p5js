class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }

  show() {
    stroke(255);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}

class Ray {
  constructor(pos, angle) {
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(angle);
  }

  show() {
    stroke(255);
    push();
    translate(this.pos.x, this.pos.y);
    // TO DRAW the rays
    // line(0, 0, this.dir.x, this.dir.y);
    pop();
  }

  lookAt(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  // uses https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
  cast(wall) {
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    // parallel lines
    if (den == 0) {
      return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      const pt = createVector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);
      return pt;
    }
  }
}

class Light {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.rays = [];
    for (let a = 0; a < 360; a += 0.3) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }
  }

  show() {
    fill(55);
    circle(this.pos.x, this.pos.y, 1);
    for (let ray of this.rays) {
      ray.show();
    }
  }

  look(walls) {
    for (let ray of this.rays) {
      let closest = null;
      let record = Infinity;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if(pt) {
          const d = p5.Vector.dist(this.pos, pt);
          if(d < record) {
            record = d;
            closest = pt;
          }
        }
      }
      
      if(closest) {
        stroke(255,50);
        line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
    }
  }

  move(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }
}

let walls = [];
let ray;
let particle;

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 5; i++) {
    walls.push(
      new Boundary(random(width), random(height), random(width), random(height))
    );
  }
  
  walls.push(new Boundary(0,0,400,0));
  walls.push(new Boundary(400,0,400,400));
  walls.push(new Boundary(400,400,0,400));
  walls.push(new Boundary(0,400,0,0));
  light = new Light();
}

function draw() {
  background(0);
  for (let wall of walls) {
    wall.show();
  }
  light.move(mouseX, mouseY);
  light.show();
  light.look(walls);
}

