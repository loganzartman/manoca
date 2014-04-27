"use strict";

var Ufo = Hostile.extend(function(props){
	this.sprite.depth = 1000;
	Graphics.stage.addChild(this.sprite);
	this.health = 20;
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