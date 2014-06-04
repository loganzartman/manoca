"use strict";

var BoraLaser = BasicLaser.extend(function(props){
	this.glow.tint = 0x44CC10;
	this.damage = 3;
})
.statics({
	texture: PIXI.Texture.fromImage("img/lasercore.png"),
	glowtexture: PIXI.Texture.fromImage("img/laserglow2.png"),
	delay: 6,
	speed: 30,
	recoil: 5
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