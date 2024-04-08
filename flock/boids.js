class Boid {
  constructor() {
    this.color = color(random(100) + 150, random(100) + 150, random(200) + 50);
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(1.5, 2.5));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 2.5;
  }

  edges() {
    if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.x > width) {
      this.position.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = width;
    }
    if (this.position.y > width) {
      this.position.y = 0;
    }
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.set(0, 0);
   }

  show() {
    fill(this.color);
    circle(this.position.x, this.position.y, 8);
  }

  align(flock) {
    const perception = 40;
    // this is the direction all boids want to go
    let avg = createVector();
    let total = 0;

    for (let other of flock) {
      // do not take this boid into consideration
      if (other == this) {
        continue;
      }

      const d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      if (d > perception) {
        continue;
      }

      total++;
      avg.add(other.velocity);
    }

    if (total > 0) {
      avg.div(total);
      avg.setMag(this.maxSpeed);
      avg.sub(this.velocity);
      avg.limit(this.maxForce);
    }

    return avg;
  }

  cohesion(flock) {
    const perception = 80;
    // this is the direction all boids want to go
    let avg = createVector();
    let total = 0;

    for (let other of flock) {
      const d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      if (other != this && d < perception) {
        avg.add(other.position);
        total++;
      }
    }

    if (total > 0) {
      avg.div(total);
      avg.sub(this.position);
      avg.setMag(this.maxSpeed);
      avg.sub(this.velocity);
      avg.limit(this.maxForce);
    }

    return avg;
  }

  separation(flock) {
    const perception = 80;
    // this is the direction all boids want to go
    let avg = createVector();
    let total = 0;

    for (let other of flock) {
      const d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      if (other != this && d < perception) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d);
        avg.add(diff);
        total++;
      }
    }

    if (total > 0) {
      avg.div(total);
      avg.setMag(this.maxSpeed);
      avg.sub(this.velocity);
      avg.limit(this.maxForce);
    }

    return avg;
  }

  
  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);
    this.acceleration.add(separation);
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
  }
}

