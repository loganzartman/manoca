"use strict";

var BoraLaser = BasicLaser.extend(function(props){
	this.glow.tint = 0x227704;
	this.damage = 3;
})
.statics({
	texture: PIXI.Texture.fromImage("img/lasercore.png"),
	glowtexture: PIXI.Texture.fromImage("img/laserglow2.png"),
	delay: 7,
	speed: 40,
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