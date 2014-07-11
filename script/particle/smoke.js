"use strict";

var Smoke = Particle.extend(function(params){
	this.type = "Smoke";
	var rand = new Random();
	this.deltaAngle = rand.next(-0.1,0.1);
	this.angle = rand.next(0,Math.PI*2);
	this.scale = params.scale*0.1||0.1;
	this.scalerate = 0.05;

	this.life = params.life||40;
	this.friction = params.friction||0;
	this.maxAlpha = 0.6;

	this.easeIn = false;
	this.easeOut = true;

	this.sprite.setTexture(Smoke.texture);
	//var val = Random.next(0x22,0x77);
	//this.sprite.tint = (val<<16) + (val<<8) + val;
	this.sprite.depth = 999;
})
.statics({
	texture: PIXI.Texture.fromImage("img/part3.png")
})
.methods({
	step: function() {
		this.supr();
		this.x+=this.xs;
		this.y+=this.ys;
		this.angle+=this.deltaAngle;
		this.deltaAngle /= (8/7);
		
		this.scale += this.scalerate;
		this.scalerate /= (15/14);
	}
});