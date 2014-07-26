"use strict";

var BasicLaser = Bullet.extend(function(props){
	this.shooter = either(props.shooter, null);

	this.sprite.scale = new PIXI.Point(0.7,1.5);
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

	this.t = 0;

	this.damage = 7;
	this.collisionMask = {
		width: 16,
		height: 16
	};
})
.statics({
	texture: PIXI.Texture.fromImage("img/lasercore.png"),
	glowtexture: PIXI.Texture.fromImage("img/laserglow.png"),
	delay: 12,
	speed: 50,
	recoil: 1
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