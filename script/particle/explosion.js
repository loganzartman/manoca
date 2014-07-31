"use strict";

var Explosion = Smoke.extend(function(params){
	this.type = "Explosion";
	this.sprite.setTexture(Explosion.texture);
	this.sprite.blendMode = PIXI.blendModes.ADD;
	this.scale = params.scale||1;

	this.tweenPoint = either(params.tweenPoint,0.1);
	this.tweens = either(params.tweens,[
		{ //begin (t<tweenPoint)
			"alpha": 0.2,
			"scale": 0
		},
		{ //mid (t==tweenPoint)
			"alpha": 0.75,
			"scale": either(params.scale,1)
		},
		{ //end (t>tweenPoint)
			"alpha": 0,
			"scale": 0.4
		}
	]);

	this.life = 30;
	this.friction = 0.1;
	this.sprite.depth = either(params.depth,1002);
	this.sprite.tint = 0xFFFFFF;
})
.statics({
	texture: PIXI.Texture.fromImage("img/explosion.png")
});