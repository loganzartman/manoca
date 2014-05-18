"use strict";

var TrailSmoke = Smoke.extend(function(params){
	var rand = new Random();
	this.deltaAngle = rand.next(-0.1,0.1);
	this.angle = rand.next(0,Math.PI*2);
	this.scale = 0.1;
	this.scalerate = 0.05;

	this.life = 60;
	this.maxAlpha = 0.2;

	this.easeTime = 0.5;
	this.easeIn = true;
	this.easeOut = false;

	this.friction = 0.1;
	var val = Random.next(0x99,0xBB);
	this.sprite.tint = (val<<16) + (val<<8) + val;
})
.methods({
	step: function() {
		this.supr();
		this.xs-=1;
	}
});