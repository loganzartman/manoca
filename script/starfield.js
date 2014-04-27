"use strict";

var Starfield = {
	g: null,
	stars: [],
	nebulae: [],
	nebula: null,
	speed: 1,

	offset: {
		x: 0,
		y: 0
	},

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
				"xs": rand.next(-30,-40),
				"ys": 0,
				"z": rand.next(1,10),
				"a": rand.next(0,0.5)
			});
		}
	},

	frame: function() {
		Starfield.g.clear();

		Starfield.nebula.position = new PIXI.Point(
			-(Starfield.nebula.width-Graphics.width)*0.5+Starfield.offset.x*0.05,
			-(Starfield.nebula.height-Graphics.height)*0.5+Starfield.offset.y*0.05
		);
		
		for (var i = Starfield.stars.length - 1; i >= 0; i--) {
			var s = Starfield.stars[i];
			s.x += (s.xs*Starfield.speed)/s.z;
			s.y += (s.ys*Starfield.speed)/s.z;
			if (s.x < 0-s.xs) {
				s.x = Graphics.width+s.x;
			}
			Starfield.g.beginFill(0xFFFFFF);
			Starfield.g.fillAlpha = s.a;
			Starfield.g.drawRect(
				Util.xmod((s.x+(Starfield.offset.x/s.z)),Graphics.width),
				Util.xmod((s.y+(Starfield.offset.y/s.z)),Graphics.height),
				s.xs/s.z,
				1
			);
			Starfield.g.endFill();
		};
	}
};