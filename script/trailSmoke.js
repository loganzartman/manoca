"use strict";

var TrailSmoke = Smoke.extend(function(params){
	var rand = new Random();
	this.deltaAngle = rand.next(-0.1,0.1);
	this.angle = rand.next(0,Math.PI*2);
	this.scale = 0.5;
	this.scalerate = 0.05;

	this.life = 40;
	this.maxAlpha = 0.8;

	this.easeIn = true;
	this.easeOut = true;
})
.methods({
	step: function() {
		this.supr();
		this.xs-=1;
	}
});