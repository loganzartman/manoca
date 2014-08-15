"use strict";

var Scout = Hostile.extend(function(props){
	this.sprite.depth = 1000;
	this.pointValue = 30;
	Graphics.stage.addChild(this.sprite);
	this.health = 3;
	this.xs = either(props.xs, Random.next(-2,-6));
	this.ys = either(props.ys, Random.next(-1,1));
	this.damage = 10;
	this.instantDestroy = true;
})
.statics({
	texture: PIXI.Texture.fromImage("img/scout.png")
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