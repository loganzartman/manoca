"use strict";

var DeimosPlasma = BasicPlasma.extend(function(props){
	this.glow.tint = 0xFF1010;
	this.damage = DeimosPlasma.damage;

	this.sound = "plasma_big";
})
.statics({
	texture: PIXI.Texture.fromImage("img/plasma-core.png"),
	glowtexture: PIXI.Texture.fromImage("img/plasma-glow.png"),
	delay: 25,
	damage: 14,
	speed: 45,
	recoil: 2,

	getDPS: BasicPlasma.getDPS
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