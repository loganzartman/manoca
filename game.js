"use strict";

var Game = {
	init: function() {
		Graphics.init();
		Starfield.init();
		Graphics.frame();
	},

	step: function() {

	}
};
window.addEventListener("load",Game.init,false);

var Graphics = {
	canvas: null,
	stage: null,
	renderer: null,
	width: 0,
	height: 0,

	init: function() {
		Graphics.canvas = document.getElementById("display");
		Graphics.canvas.width = Graphics.width = window.innerWidth;
		Graphics.canvas.height = Graphics.height = window.innerHeight;
		Graphics.stage = new PIXI.Stage(0x000000);
		Graphics.renderer = PIXI.autoDetectRenderer(
			Graphics.width,
			Graphics.height,
			Graphics.canvas
		);

		window.addEventListener("resize", Graphics.resize, false);
	},

	frame: function() {
		Game.step();
		Starfield.frame();

		Graphics.renderer.render(Graphics.stage);

		requestAnimationFrame(Graphics.frame);
	},

	resize: function(event) {
		Graphics.width = window.innerWidth;
		Graphics.height = window.innerHeight;
		Graphics.renderer.view.width = Graphics.width;
		Graphics.renderer.view.height = Graphics.height;
	}
};

var Starfield = {
	g: null,
	stars: [],
	nebulae: [],
	nebula: null,
	speed: 1,

	init: function() {
		Starfield.g = new PIXI.Graphics();
		Graphics.stage.addChild(Starfield.g);
		
		for (var i=0; i<1; i++) {
			Starfield.nebulae.push(PIXI.Texture.fromImage("nebula"+i+".png"));
		}
		Starfield.nebula = new PIXI.Sprite(Starfield.nebulae[0]);
		Starfield.nebula.position = new PIXI.Point(0,0);
		Graphics.stage.addChildAt(Starfield.nebula,0);

		var rand = new Random();
		var nstars = (Graphics.width*Graphics.height)/5000;
		for (var i=0; i<nstars; i++) {
			Starfield.stars.push({
				"x": ~~rand.next(0,Graphics.width),
				"y": ~~rand.next(0,Graphics.height),
				"xs": rand.next(0,-20),
				"ys": 0,
				"a": rand.next(0,1)
			});
		}
	},

	frame: function() {
		Starfield.g.clear();
		
		for (var i = Starfield.stars.length - 1; i >= 0; i--) {
			var s = Starfield.stars[i];
			s.x += s.xs*Starfield.speed;
			s.y += s.ys*Starfield.speed;
			if (s.x < 0-s.xs) {
				s.x = Graphics.width+s.x;
			}
			Starfield.g.beginFill(0xFFFFFF);
			Starfield.g.fillAlpha = s.a;
			Starfield.g.drawRect(s.x,s.y,s.xs,1);
			Starfield.g.endFill();
		};
	}
};

function Random(seed) {
	this.seed = seed || Date.now();
}
Random.prototype.next = function(min,max) {
	if (typeof min === "number") {
    	if (typeof max !== "number") {
    		max = min;
    		min = 0;
    	}
	}
	else {
		min = 0;
		max = 1;
	}

	var x = Math.sin(this.seed++) * 10000;
    return (x - Math.floor(x))*(max-min)+min;
}

function Ship() {

}