"use strict";

var BasicPlasma = Bullet.extend(function(props){
	this.shooter = either(props.shooter, null);

	this.sprite.scale = new PIXI.Point(0.7,1.5);
	this.sprite.blendMode = PIXI.blendModes.ADD;
	this.sprite.depth = 50;
	this.angle = Math.atan2(this.xs,-this.ys);
	this.sprite.depth = 1000;
	this.updateSprite();
	Graphics.stage.addChild(this.sprite);

	this.glow = new PIXI.Sprite(BasicPlasma.glowtexture);
	this.glow.tint = 0x4477FF;
	this.glow.position = new PIXI.Point(0,0);
	this.glow.anchor = new PIXI.Point(0.5,0.5);
	this.glow.blendMode = PIXI.blendModes.ADD;
	this.sprite.addChild(this.glow);

	this.sound = "plasma";

	this.t = 0;

	this.damage = BasicPlasma.damage;
	this.collisionMask = {
		width: 16,
		height: 16
	};
})
.statics({
	texture: PIXI.Texture.fromImage("img/plasma-core.png"),
	glowtexture: PIXI.Texture.fromImage("img/plasma-glow.png"),
	delay: 12,
	damage: 7,
	speed: 50,
	recoil: 1,

	getDPS: function() {
		return this.damage*60/this.delay;
	}
})
.methods({
	updateSprite: function() {
		this.sprite.position = new PIXI.Point(
			this.x,
			this.y
		);
		this.sprite.rotation = this.angle;

		this.t++;
		var scale = Math.max(0,1-((this.t*this.t)/40))*0.5;
		this.sprite.scale = new PIXI.Point(0.7+scale,1.5+scale);
	},

	step: function() {
		this.supr();

		this.angle = Math.atan2(this.xs,-this.ys);
		
		this.updateSprite();
	}
});