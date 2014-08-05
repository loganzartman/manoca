"use strict";

var CruiserLaser = BasicLaser.extend(function(props){
	this.glow.tint = 0xFF2210;

	this.sound = "laser_big";

	this.damage = CruiserLaser.damage;
})
.statics({
	texture: PIXI.Texture.fromImage("img/lasercore.png"),
	glowtexture: PIXI.Texture.fromImage("img/laserglow2.png"),
	delay: 120,
	damage: 15,
	speed: 15,
	recoil: 4
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