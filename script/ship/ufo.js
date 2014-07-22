"use strict";

var Ufo = Hostile.extend(function(props){
	this.sprite.depth = 1000;
	this.pointValue = 150;
	Graphics.stage.addChild(this.sprite);
	this.health = 13;
	this.xs = either(props.xs, Random.next(-2,-6));
	this.ys = either(props.ys, Random.next(-1,1));
	this.damage = 30;
	this.instantDestroy = true;
})
.statics({
	texture: PIXI.Texture.fromImage("img/ufoGreen.png")
})
.methods({
	updateSprite: function() {
		this.supr();
	},
	step: function() {
		this.supr();

		this.updateSprite();
	}
});