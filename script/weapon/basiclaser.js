"use strict";

var BasicLaser = Bullet.extend(function(props){
	this.shooter = either(props.shooter, null);

	this.sprite.scale = new PIXI.Point(1,2);
	this.sprite.blendMode = PIXI.blendModes.ADD;
	this.sprite.depth = 50;
	this.angle = Math.atan2(this.xs,-this.ys);
	this.sprite.depth = 1000;
	this.updateSprite();
	Graphics.stage.addChild(this.sprite);

	this.glow = new PIXI.Sprite(BasicLaser.glowtexture);
	this.glow.tint = 0x4477FF;
	this.glow.position = new PIXI.Point(0,0);
	this.glow.anchor = new PIXI.Point(0.5,0.5);
	this.glow.blendMode = PIXI.blendModes.ADD;
	this.sprite.addChild(this.glow);

	this.damage = 7;
	this.collisionMask = {
		width: 16,
		height: 16
	};
})
.statics({
	texture: PIXI.Texture.fromImage("img/lasercore.png"),
	glowtexture: PIXI.Texture.fromImage("img/laserglow2.png"),
	delay: 12,
	speed: 40,
	recoil: 1
})
.methods({
	updateSprite: function() {
		this.sprite.position = new PIXI.Point(
			this.x,
			this.y
		);
		this.sprite.rotation = this.angle;
	},

	step: function() {
		this.supr();

		this.angle = Math.atan2(this.xs,-this.ys);
		
		this.updateSprite();
	}
});