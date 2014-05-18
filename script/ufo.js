"use strict";

var Ufo = Hostile.extend(function(props){
	this.sprite.depth = 1000;
	Graphics.stage.addChild(this.sprite);
	this.health = 20;
	this.xs = either(props.xs, Random.next(-2,-6));
	this.ys = either(props.ys, Random.next(-1,1));
})
.statics({
	texture: PIXI.Texture.fromImage("img/ufoGreen.png"),
})
.methods({
	updateSprite: function() {
		this.supr();
	},
	step: function() {
		this.supr();

		if (this.collidesCircles(Game.player)) {
			this.kill();
			Game.player.kill();
		}

		this.updateSprite();
	}
});