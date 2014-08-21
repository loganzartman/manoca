"use strict";

var Starfield = {
	g: null,
	stars: [],
	nebulae: [],
	nebula: null,
	starTexture: null,
	speed: 1,
	menuSpeed: 0.05,
	gameSpeed: 1,
	dispFilter: null,
	isWarping: false,
	warpTime: 0,
	hypSprite: null,
	hypFlash: null,

	offset: {
		x: 0,
		y: 0
	},

	init: function() {
		Starfield.g = new PIXI.SpriteBatch();
		Starfield.g.depth = 10;
		
		Starfield.dispFilter = new PIXI.DisplacementFilter(Graphics.texture.displacement1);
		Starfield.hypSprite = new PIXI.TilingSprite(Graphics.texture.hyperspace,1920,1080);
		Starfield.hypSprite.generateTilingTexture(true);
		Starfield.hypSprite.depth = 1;

		Starfield.hypFlash = new PIXI.Graphics();
		Starfield.hypFlash.beginFill(0xFFFFFF);
		Starfield.hypFlash.drawRect(0,0,Graphics.width,Graphics.height);
		Starfield.hypFlash.endFill();
		Starfield.hypFlash.depth = 10000;

		Starfield.starTexture = PIXI.Texture.fromImage("img/star.png");

		for (var i=0; i<1; i++) {
			Starfield.nebulae.push(PIXI.Texture.fromImage("img/nebula"+i+".png"));
		}
		Starfield.nebula = new PIXI.Sprite(Starfield.nebulae[0]);
		Starfield.nebula.position = new PIXI.Point(0,0);
		Starfield.nebula.depth = 0;

		var rand = new Random();
		var nstars = (Graphics.width*Graphics.height)/2000;
		for (var i=0; i<nstars; i++) {
			Starfield.stars.push({
				"x": ~~rand.next(0,Graphics.width),
				"y": ~~rand.next(0,Graphics.height),
				"xs": rand.next(-30,-40),
				"ys": 0,
				"z": rand.next(2,7),
				"a": 0.7
			});
			var sprt = new PIXI.Sprite(Starfield.starTexture);
			sprt.anchor = new PIXI.Point(0.5,0.5);
			Starfield.g.addChild(sprt);
		}

		Starfield.addToContainer(Graphics.stage);
		Starfield.addToContainer(MainMenu.stage);
	},

	beginWarp: function() {
		Starfield.playedFireSound = false;
		Sound.play("hyperdrive_start");
		Starfield.nebula.filters = [Starfield.dispFilter];
		Starfield.dispFilter.scale = new PIXI.Point(0,0);
		Starfield.dispFilter.offset = new PIXI.Point(0,0);
		Starfield.warpTime = 0;
		Starfield.hypSprite.alpha = 0;
		Starfield.hypFlash.alpha = 0;
		Starfield.hypSprite.position = new PIXI.Point(0,0);
		Starfield.hypSprite.filters = [Starfield.dispFilter];
		Graphics.activeStage.addChild(Starfield.hypSprite);
		Graphics.activeStage.addChild(Starfield.hypFlash);
		Starfield.isWarping = true;
	},

	resetWarp: function() {
		Sound.stop("hyperdrive_start");
		Starfield.nebula.filters = undefined;
		Starfield.dispFilter.scale = new PIXI.Point(0,0);
		Starfield.dispFilter.offset = new PIXI.Point(0,0);
		Starfield.hypSprite.alpha = 0;
		Starfield.warpTime = 0;
		Starfield.speed = 1;
		Starfield.hypSprite.filters = undefined;
		//Graphics.activeStage.removeChild(Starfield.hypSprite);
		Starfield.isWarping = false;
	},

	addToContainer: function(stage, texture) {
		if (texture) {
			Starfield.nebula.setTexture(texture);
		}

		stage.addChild(Starfield.g);
		stage.addChildAt(Starfield.nebula,0);
	},

	frame: function() {
		Starfield.nebula.position = new PIXI.Point(
			-(Starfield.nebula.width-Graphics.width)*0.5+Starfield.offset.x*0.5,
			-(Starfield.nebula.height-Graphics.height)*0.5+Starfield.offset.y*0.5
		);

		if (Starfield.isWarping) {
			Starfield.warpTime += 0.005;
			var cubic = Util.easeInCubic(Math.min(1,Starfield.warpTime), 0, 1, 1);

			if (Starfield.warpTime<1) {
				Starfield.dispFilter.scale = new PIXI.Point(cubic*200, cubic*200);
			}
			else {
				if (!Starfield.playedFireSound) {
					Sound.play("hyperdrive_fire");
					Starfield.playedFireSound = true;
				}
				Starfield.speed = 2;
				Starfield.hypSprite.alpha = 1;
				Starfield.hypSprite.tilePosition.x -= 60;
				Starfield.hypFlash.alpha = Math.max(0,1-(Starfield.warpTime*2-2));
			}

			Starfield.dispFilter.offset.x += cubic*30;
		}
		
		for (var i = Starfield.stars.length - 1; i >= 0; i--) {
			var s = Starfield.stars[i];
			s.x += (s.xs*Starfield.speed)/(8-s.z);
			s.y += (s.ys*Starfield.speed)/(8-s.z);


			var star = Starfield.g.children[i];

			star.alpha = Math.min(0.75,s.a/(6-s.z*0.75))*0.7;

			star.position = new PIXI.Point(
				Util.xmod((s.x+(Starfield.offset.x/s.z)),Graphics.width-s.xs/(8-s.z)*2),
				Util.xmod((s.y+(Starfield.offset.y/s.z)),Graphics.height)
			);
			star.scale = new PIXI.Point(
				(Starfield.warpTime>1?2:1)*(s.xs*(Math.abs(Starfield.speed)<0.1?sign(Starfield.speed)*0.1:Starfield.speed)/(8-s.z))/(48),
				Math.max(0.1,s.z/24)
			);
		};
	}
};