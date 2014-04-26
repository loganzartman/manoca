"use strict";
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
			Starfield.nebulae.push(PIXI.Texture.fromImage("img/nebula"+i+".png"));
		}
		Starfield.nebula = new PIXI.Sprite(Starfield.nebulae[0]);
		Starfield.nebula.position = new PIXI.Point(0,0);
		Starfield.nebula.depth = 0;
		Graphics.stage.addChildAt(Starfield.nebula,0);

		var rand = new Random();
		var nstars = (Graphics.width*Graphics.height)/5000;
		for (var i=0; i<nstars; i++) {
			Starfield.stars.push({
				"x": ~~rand.next(0,Graphics.width),
				"y": ~~rand.next(0,Graphics.height),
				"xs": rand.next(0,-20),
				"ys": 0,
				"a": rand.next(0,0.5)
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