"use strict";

var DeimosLaser = BasicLaser.extend(function(props){
	this.glow.tint = 0xFF1010;
	this.damage = DeimosLaser.damage;

	this.sound = "laser_big";
})
.statics({
	texture: PIXI.Texture.fromImage("img/lasercore.png"),
	glowtexture: PIXI.Texture.fromImage("img/laserglow2.png"),
	delay: 25,
	damage: 14,
	speed: 45,
	recoil: 2
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