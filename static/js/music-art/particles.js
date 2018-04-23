var system;

function setup() {
  createCanvas(720, 400);
  system = new ParticleSystem(createVector(width / 2, 50));
}

function draw() {
  if (analyser == null || freqAnalyser == null) {
    return
  }
  analyser.getByteTimeDomainData(timeDomainData);
  freqAnalyser.getByteFrequencyData(frequencyData);
  background(51);
  if (isPlaying) {
    system.addParticle();
  }
  system.run();
}

// A simple Particle class
var Particle = function(position, acceleration = null, velocity = null) {
  this.acceleration = acceleration ? acceleration : createVector(0, 0.05);
  this.velocity = velocity ? velocity : createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255.0;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(acceleration = null, velocity = null) {
  this.velocity.add(acceleration ? acceleration : this.acceleration);
  this.position.add(velocity ? velocity : this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function(color = null, size = 12, my_stroke = 200, weight = 2) {
  stroke(my_stroke, this.lifespan);
  strokeWeight(weight);
  if (color != null) {
    fill(color['r'], color['g'], color['b'], color['a'], this.lifespan);
  } else {
    fill(127, this.lifespan); // TODO: rgba
  }
  ellipse(this.position.x, this.position.y, size, size);
};

// Is the particle still useful?
Particle.prototype.isDead = function() {
  return (this.lifespan < 0);
};

var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};