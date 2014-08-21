"use strict";

var DummyShip = Hostile.extend(function(props){
	this.sprite.depth = 1000;
	Graphics.stage.addChild(this.sprite);
	this.health = Infinity;
	this.pointValue = 10;
	this.xs = either(props.xs, 0);
	this.ys = either(props.ys, 0);
	Graphics.addEngineFire(this, "engineFire", new PIXI.Point(18,0), 0xFF8844);

	this.angle = Math.PI;

	this.damage = 10;
	this.instantDestroy = false;
})
.statics({
	texture: PIXI.Texture.fromImage("img/enemyRed4.png")
})
.methods({
	updateSprite: function() {
		this.supr();
		this.engineFire.updateSprite();
	},
	step: function() {
		this.supr();
		this.updateSprite();
	}
});