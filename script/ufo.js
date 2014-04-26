"use strict";

var Ufo = Hostile.extend(function(props){
	this.sprite.depth = 1000;
	Graphics.stage.addChild(this.sprite);
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

		for (var i = Game.entities.length - 1; i >= 0; i--) {
			var e = Game.entities[i];
			if (e instanceof Bullet) {
				if (this.collidesCircles(e)) {
					e.destroy();
					this.kill();
					break;
				}
			}
		}

		this.updateSprite();
	}
});