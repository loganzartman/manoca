"use strict";

var Worm = Hostile.extend(function(props){
	this.sprite.depth = 1000;
	Graphics.stage.addChild(this.sprite);
	this.health = 30;
	this.xs = either(props.xs, Random.next(-3,-6));
	this.ys = either(props.ys, Random.next(-1,1));

	this.startX = either(props.x, Graphics.width+Ufo.texture.width/2);
	this.startY = either(props.y, Random.next(0,Graphics.height));

	this.frequency = either(props.frequency, 0.01);

	this.x = this.startX;
	this.y = this.startY;
	
	this.c = either(props.c, Random.next(Math.PI))*(1/this.frequency);

	Graphics.addEngineFire(this, "engineFire", new PIXI.Point(14,0), 0xFF8844);

	this.pointValue = 1000;
})
.statics({
	texture: PIXI.Texture.fromImage("img/enemyBlack5.png")
})
.methods({
	updateSprite: function() {
		this.supr();
		this.sprite.rotation = Math.atan2(this.ys,this.xs);
		this.engineFire.updateSprite();
	},

	step: function() {
		this.supr();
		this.ys = Math.sin((this.c++)*this.frequency)*2;
		this.updateSprite();
	}
});