"use strict";

var Smoke = Particle.extend(function(params){
	this.type = "Smoke";
	var rand = new Random();
	this.deltaAngle = rand.next(-0.1,0.1);
	this.angle = rand.next(0,Math.PI*2);

	this.life = params.life||40;
	this.friction = params.friction||0;

	this.tweenPoint = either(params.tweenPoint,0.4);
	this.tweens = either(params.tweens,[
		{
			"alpha": 1,
			"scale": either(params.scale,1)
		},
		{
			"alpha": 0.4,
			"scale": either(params.scale*1.2,1.2)
		},
		{
			"alpha": 0,
			"scale": either(params.scale*2,2)
		}
	]);

	this.sprite.setTexture(Smoke.texture);
	this.sprite.depth = either(params.depth,1001);
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
	}
});