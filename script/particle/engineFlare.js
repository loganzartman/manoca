"use strict";

var EngineFlare = Particle.extend(function(params){
	this.type = "EngineFlare";
	var rand = new Random();
	this.deltaAngle = rand.next(-0.1,0.1);
	this.angle = rand.next(0,Math.PI*2);
	this.scale = 0.6;
	this.scaleRate = -0.025;

	this.life = 20;
	this.maxAlpha = 1;
	this.minAlpha = 0;

	this.easeIn = false;
	this.easeOut = true;

	this.friction = 0.1;
	this.sprite.setTexture(EngineFlare.texture);
	this.sprite.blendMode = PIXI.blendModes.ADD;
	this.sprite.tint = params.tint;
	
	this.sprite.depth = 1001;
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