"use strict";

var EngineFlare = Particle.extend(function(params){
	this.type = "EngineFlare";
	var rand = new Random();
	this.deltaAngle = rand.next(-0.1,0.1);
	this.angle = rand.next(0,Math.PI*2);
	this.scale = either(params.scale,0.6);
	this.scaleRate = -0.025;

	this.friction = 0;

	this.life = either(params.life,20);

	this.tweens = either(params.tweens, [
		{
			"alpha": 1,
			"scale": 0.4
		},
		{
			"alpha": 0.75,
			"scale": 0.5
		},
		{
			"alpha": 0,
			"scale": 0
		}
	]);

	this.friction = 0.1;
	this.sprite.setTexture(EngineFlare.texture);
	this.sprite.blendMode = PIXI.blendModes.ADD;
	this.sprite.tint = either(params.tint,0xFFFFFF);
	
	this.sprite.depth = 1002;
})
.statics({
	tintable: true,
	texture: PIXI.Texture.fromImage("img/flare.png")
})
.methods({
	step: function() {
		this.supr();
	}
});