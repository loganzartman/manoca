"use strict";

var TestParticle = Particle.extend(function(params){
	this.type = "TestParticle";
	this.life = either(params.life, 120);

	this.tweenPoint = 0.5;
	this.tweens = either(params.tweens, [
		{
			"red": 255,
			"green": 0,
			"blue": 0
		},
		{
			"red": 0,
			"green": 255,
			"blue": 0
		},
		{
			"red": 0,
			"green": 0,
			"blue": 255
		}
	]);
})
.statics({
	tintable: true,
	texture: PIXI.Texture.fromImage("img/none.png")
})
.methods({
	step: function() {
		this.supr();
		this.xs += 0.2;
	}
});