"use strict";

var Explosion = Smoke.extend(function(params){
	this.type = "Explosion";
	this.sprite.setTexture(Explosion.texture);
	this.sprite.blendMode = PIXI.blendModes.ADD;
	this.scale = params.scale||1;
	this.scalerate = 0.1;
	this.easeIn = false;
	this.life = 30;
	this.friction = 0.1;
	this.sprite.depth = 1002;
	this.sprite.tint = 0xFFFFFF;
	this.maxAlpha = params.maxAlpha||1;
})
.statics({
	texture: PIXI.Texture.fromImage("img/explosion.png")
});