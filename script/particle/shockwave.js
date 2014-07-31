"use strict";

var Shockwave = Particle.extend(function(params){
	this.type = "Shockwave";
	this.life = either(params.life, 15);

	this.tweenPoint = either(params.tweenPoint,0.5);
	this.tweens = either(params.tweens, [
		{
			"alpha": 1,
			"scale": 0
		},
		{
			"alpha": 1,
			"scale": 1
		},
		{
			"alpha": 0,
			"scale": 1.5
		}
	]);

	this.scale = 0;

	this.sprite.blendMode = PIXI.blendModes.ADD;
	this.sprite.setTexture(Shockwave.texture);
})
.statics({
	tintable: true,
	texture: PIXI.Texture.fromImage("img/shockwave.png")
})
.methods({
	step: function() {
		this.supr();
		this.xs += 0.2;
	}
});