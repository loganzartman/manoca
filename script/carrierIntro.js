"use strict";

var CarrierIntro = {
	texTop: null,
	texBottom: null,
	x: 0,
	y: 0,
	stage: null,

	duration: 60*7,
	t: 0,

	init: function(stage) {
		CarrierIntro.stage = stage;
		CarrierIntro.texTop = PIXI.Texture.fromImage("img/carrier-top.png");
		CarrierIntro.texBottom = PIXI.Texture.fromImage("img/carrier-bottom.png");

		CarrierIntro.t = 0;
		CarrierIntro.x = Graphics.width/2;
		CarrierIntro.y = Graphics.height/2 - CarrierIntro.texTop.height/2;

		CarrierIntro.spriteTop = new PIXI.Sprite(CarrierIntro.texTop);
		CarrierIntro.spriteTop.depth = 1001;
		CarrierIntro.spriteBottom = new PIXI.Sprite(CarrierIntro.texBottom);
		CarrierIntro.spriteBottom.depth = 999;
		CarrierIntro.updateSprite();

		CarrierIntro.blackout = new PIXI.Graphics();
		CarrierIntro.blackout.beginFill(0x000000, 1);
		CarrierIntro.blackout.drawRect(0,0,Graphics.width,Graphics.height);
		CarrierIntro.blackout.position = {x:0, y:0};
		CarrierIntro.blackout.depth = 21000;
		CarrierIntro.stage.addChild(CarrierIntro.blackout);

		CarrierIntro.leveltext = new PIXI.Text(Level.name, {
			font: "bold 40px 'Exo'",
			fill: "white",
			stroke: "black",
			align: "left",
			strokeThickness: 4
		});
		CarrierIntro.leveltext.position = new PIXI.Point(
			Graphics.width/2 - CarrierIntro.leveltext.width/2,
			Graphics.height/3
		);
		CarrierIntro.leveltext.depth = 21001;
		CarrierIntro.stage.addChild(CarrierIntro.leveltext);

		CarrierIntro.stage.addChild(CarrierIntro.blackout);
		CarrierIntro.stage.addChild(CarrierIntro.spriteBottom);
		CarrierIntro.stage.addChild(CarrierIntro.spriteTop);
	},

	updateSprite: function() {
		CarrierIntro.spriteTop.position = new PIXI.Point(CarrierIntro.x, CarrierIntro.y);
		CarrierIntro.spriteBottom.position = new PIXI.Point(CarrierIntro.x, CarrierIntro.y);
	},

	step: function() {
		CarrierIntro.t++;
		CarrierIntro.x = Graphics.width/2 - (Util.easeInCubic(CarrierIntro.t,0,1,CarrierIntro.duration)+CarrierIntro.t/CarrierIntro.duration)*0.5*(Graphics.width/2+CarrierIntro.texTop.width);
		CarrierIntro.y = Graphics.height/2 - CarrierIntro.texTop.height/2;

		//control the player
		if (CarrierIntro.t<CarrierIntro.duration) {
			var yoffset = Math.min(1,1-Util.easeInOutCubic(CarrierIntro.t-CarrierIntro.duration*1/4, 0, 1, CarrierIntro.duration*1/2));
			var xoffset = Math.min(1,1-Util.easeInCubic(CarrierIntro.t-CarrierIntro.duration*1/4, 0, 1, CarrierIntro.duration*2/3));

			var dx = Graphics.width*0.5 - (xoffset-0.8)*300 - Game.player.x,
				dy = Graphics.height*0.5 - yoffset*200 - Game.player.y;
			var clutch = Math.min(1,1 - (CarrierIntro.t-CarrierIntro.duration*(2/3)) / (CarrierIntro.duration*(1/3)));
			Game.player.x += dx*clutch;
			Game.player.y += dy*clutch;
			Game.player.xs *= 1-clutch;
			Game.player.ys *= 1-clutch;
		}

		if (CarrierIntro.blackout) {
			var bav = Math.min(1,1-((CarrierIntro.t-CarrierIntro.duration/6)/(CarrierIntro.duration/3)));
			if (bav>0) CarrierIntro.blackout.alpha = bav;
			else {
				CarrierIntro.stage.removeChild(CarrierIntro.blackout);
				CarrierIntro.blackout = null;
			}
		}

		if (CarrierIntro.leveltext) {
			var lav = Math.min(1,1-(CarrierIntro.t-CarrierIntro.duration*(1/2))/(CarrierIntro.duration*1/3));
			if (lav>0) CarrierIntro.leveltext.alpha = lav;
			else {
				CarrierIntro.stage.removeChild(CarrierIntro.leveltext);
				CarrierIntro.leveltext = null;
			}
		}

		CarrierIntro.updateSprite();
	},

	destroy: function() {
		//remove sprites from stage
		CarrierIntro.stage.removeChild(CarrierIntro.spriteTop);
		CarrierIntro.stage.removeChild(CarrierIntro.spriteBottom);
	}
};