"use strict";

var Cruiser = Hostile.extend(function(props){
	this.sprite.depth = 1000.5;
	Graphics.stage.addChild(this.sprite);
	this.health = 100;
	this.pointValue = 2500;
	this.xs = either(props.xs, Random.next(-1,-2));
	this.ys = either(props.ys, 0);
	Graphics.addEngineFire(this, "engineFire", new PIXI.Point(18,0), 0xFF8844);
})
.statics({
	texture: PIXI.Texture.fromImage("img/enemyRed4.png")
})
.methods({
	updateSprite: function() {
		this.supr();
		this.engineFire.updateSprite();
		this.sprite.rotation = Math.PI;
	},
	step: function() {
		this.supr();

		this.updateSprite();
	}
});