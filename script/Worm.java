"use strict";

var Worm = Hostile.extend(function(props){
	this.sprite.depth = 1000;
	Graphics.stage.addChild(this.sprite);
	this.health = 30;
	this.xs = either(props.xs, Random.next(-2,-6));
	this.ys = either(props.ys, Random.next(-1,1));

	this.startX = either(props.x, Graphics.width+Ufo.texture.width/2);
	this.startY = either(props.y, Random.next(0,Graphics.height));
	this.x = this.startX;
	this.y = this.startY;
	this.sprite.tint = 0xFF0000;
	this.c = 0;
})
.statics({
	texture: PIXI.Texture.fromImage("img/ufoGreen.png")
})
.methods({
	step: function() {
		this.x += this.xs;
		this.y = Math.sin((this.c++)*0.1)*200;
	}
});