"use strict";

var BoraPlasma = BasicPlasma.extend(function(props){
	this.glow.tint = 0x227704;
	this.damage = BoraPlasma.damage;

	this.sound = "plasma_small";
})
.statics({
	texture: PIXI.Texture.fromImage("img/plasma-core.png"),
	glowtexture: PIXI.Texture.fromImage("img/plasma-glow.png"),
	delay: 7,
	damage: 3,
	speed: 57,
	recoil: 5,

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