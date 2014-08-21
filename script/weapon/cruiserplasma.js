"use strict";

var CruiserPlasma = BasicPlasma.extend(function(props){
	this.glow.tint = 0xFF2210;

	this.sound = "plasma_big";

	this.damage = CruiserPlasma.damage;
})
.statics({
	texture: PIXI.Texture.fromImage("img/plasma-core.png"),
	glowtexture: PIXI.Texture.fromImage("img/plasma-glow.png"),
	delay: 120,
	damage: 15,
	speed: 15,
	recoil: 4,

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