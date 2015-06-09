var Walker = function() {
	this.x = width / 2;
	this.y = height / 2;
	this.top = random(1.0);
	this.bottom = random(1.0);
	this.left = random(1.0);
	this.right = random(1.0);
	this.radian = random(3.0);
};

Walker.prototype.draw = function() {
    this.radian = random(3.0);
    this.x += random(-this.left, this.right);
    this.y += random(-this.top, this.bottom);

    ellipse(this.x, this.y, this.radian, this.radian);
};

var walkers = [];

function reset() {
	walkers = [];
	for (var i = 0; i < 1000; ++i) {
		walkers.push(new Walker());
	}

	background(0);
}

var ipc = require('ipc');

function setup(){
	createCanvas(windowWidth, windowHeight);
	frameRate(60);

	reset();
}

function draw() {
	noFill();
	fill(0, 0, 0, 10);
	rect(0, 0, width, height);

	noStroke();
	fill(255, 10);
	for (var i = 0; i < walkers.length; ++i) {
    	walkers[i].draw();
  	}
}

function keyPressed() {
	console.log(keyCode);
	if (keyCode == 82) { // R key
		reset();
	}
	else if (keyCode == ESCAPE) {
		ipc.send("app_quit");
	}
}
