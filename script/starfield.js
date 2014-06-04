"use strict";

var Starfield = {
	g: null,
	stars: [],
	nebulae: [],
	nebula: null,
	starTexture: null,
	speed: 1,

	offset: {
		x: 0,
		y: 0
	},

	init: function() {
		Starfield.g = new PIXI.SpriteBatch();
		Starfield.g.depth = 10;
		
		Starfield.starTexture = PIXI.Texture.fromImage("img/star.png");

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
			Starfield.g.addChild(new PIXI.Sprite(Starfield.starTexture));
		}

		Starfield.addToContainer(Graphics.stage);
		Starfield.addToContainer(MainMenu.stage);
	},

	addToContainer: function(stage) {
		stage.addChild(Starfield.g);
		stage.addChildAt(Starfield.nebula,0);
	},

	frame: function() {
		Starfield.nebula.position = new PIXI.Point(
			-(Starfield.nebula.width-Graphics.width)*0.5+Starfield.offset.x*0.5,
			-(Starfield.nebula.height-Graphics.height)*0.5+Starfield.offset.y*0.5
		);
		
		for (var i = Starfield.stars.length - 1; i >= 0; i--) {
			var s = Starfield.stars[i];
			s.x += (s.xs*Starfield.speed)/(8-s.z);
			s.y += (s.ys*Starfield.speed)/(8-s.z);


			var star = Starfield.g.children[i];
			star.alpha = s.a/(8-s.z);

			star.alpha = s.a/(8-s.z);
			star.position = new PIXI.Point(
				Util.xmod((s.x+(Starfield.offset.x/s.z)),Graphics.width-s.xs/(8-s.z)*2),
				Util.xmod((s.y+(Starfield.offset.y/s.z)),Graphics.height)
			);
			star.scale = new PIXI.Point(
				(s.xs/(8-s.z))/(48),
				(Math.max(1,1/(8-s.z)))/3
			);
		};
	}
};