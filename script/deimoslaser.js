"use strict";

var DeimosLaser = BasicLaser.extend(function(props){
	this.glow.tint = 0xFF1010;
	this.damage = 12;
})
.statics({
	texture: PIXI.Texture.fromImage("img/lasercore.png"),
	glowtexture: PIXI.Texture.fromImage("img/laserglow2.png"),
	delay: 30,
	speed: 30,
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