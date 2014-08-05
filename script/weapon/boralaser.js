"use strict";

var BoraLaser = BasicLaser.extend(function(props){
	this.glow.tint = 0x227704;
	this.damage = BoraLaser.damage;

	this.sound = "laser_small";
})
.statics({
	texture: PIXI.Texture.fromImage("img/lasercore.png"),
	glowtexture: PIXI.Texture.fromImage("img/laserglow2.png"),
	delay: 7,
	damage: 3,
	speed: 57,
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