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
		Starfield.g.depth = 10;
		
		for (var i=0; i<1; i++) {
			Starfield.nebulae.push(PIXI.Texture.fromImage("img/nebula"+i+".png"));
		}
		Starfield.nebula = new PIXI.Sprite(Starfield.nebulae[0]);
		Starfield.nebula.position = new PIXI.Point(0,0);
		Starfield.nebula.depth = 0;

		var rand = new Random();
		var nstars = (Graphics.width*Graphics.height)/3000;
		for (var i=0; i<nstars; i++) {
			Starfield.stars.push({
				"x": ~~rand.next(0,Graphics.width),
				"y": ~~rand.next(0,Graphics.height),
				"xs": rand.next(-30,-40),
				"ys": 0,
				"z": rand.next(2,7),
				"a": 0.7
			});
		}

		Starfield.addToContainer(Graphics.stage);
		Starfield.addToContainer(MainMenu.stage);
	},

	addToContainer: function(stage) {
		stage.addChild(Starfield.g);
		stage.addChildAt(Starfield.nebula,0);
	},

	frame: function() {
		Starfield.g.clear();

		Starfield.nebula.position = new PIXI.Point(
			-(Starfield.nebula.width-Graphics.width)*0.5+Starfield.offset.x*0.5,
			-(Starfield.nebula.height-Graphics.height)*0.5+Starfield.offset.y*0.5
		);
		
		for (var i = Starfield.stars.length - 1; i >= 0; i--) {
			var s = Starfield.stars[i];
			s.x += (s.xs*Starfield.speed)/(8-s.z);
			s.y += (s.ys*Starfield.speed)/(8-s.z);
			if (s.x < s.xs/(8-s.z)) {
				//s.y = Random.next(Graphics.height)
			}
			Starfield.g.beginFill(0xFFFFFF);
			Starfield.g.fillAlpha = s.a/(8-s.z);
			Starfield.g.drawRect(
				Util.xmod((s.x+(Starfield.offset.x/s.z)),Graphics.width-s.xs/(8-s.z)),
				Util.xmod((s.y+(Starfield.offset.y/s.z)),Graphics.height),
				s.xs/(8-s.z),
				Math.max(1,1/(8-s.z))
			);
			Starfield.g.endFill();
		};
	}
};