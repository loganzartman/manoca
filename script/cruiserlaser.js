"use strict";

var CruiserLaser = BasicLaser.extend(function(props){
	this.glow.tint = 0xFF2210;

	//todo: player health
	this.damage = 5;
})
.statics({
	texture: PIXI.Texture.fromImage("img/lasercore.png"),
	glowtexture: PIXI.Texture.fromImage("img/laserglow2.png"),
	delay: Time.sec(1.5),
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