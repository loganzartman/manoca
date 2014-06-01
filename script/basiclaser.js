"use strict";

var BasicLaser = Bullet.extend(function(props){
	this.sprite.scale = new PIXI.Point(1,2);
	this.sprite.blendMode = PIXI.blendModes.ADD;
	this.sprite.depth = 50;
	this.angle = Math.atan2(this.xs,-this.ys);
	this.updateSprite();
	Graphics.stage.addChild(this.sprite);

	this.glow = new PIXI.Sprite(BasicLaser.glowtexture);
	this.glow.tint = 0x3322FF;
	this.glow.position = new PIXI.Point(0,0);
	this.glow.anchor = new PIXI.Point(0.5,0.5);
	this.glow.blendMode = PIXI.blendModes.ADD;
	this.sprite.addChild(this.glow);

	this.damage = 7;
})
.statics({
	texture: PIXI.Texture.fromImage("img/lasercore.png"),
	glowtexture: PIXI.Texture.fromImage("img/laserglow2.png"),
	delay: Time.sec(0.2),
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
		this.x += this.xs;
		this.y += this.ys;

		if (this.x<-this.sprite.width/2 || 
			this.y<-this.sprite.height/2 ||
			this.x>Graphics.width+this.sprite.width/2 ||
			this.y>Graphics.height+this.sprite.height/2) 
		{
			Game.entities.splice(Game.entities.indexOf(this),1);
			Graphics.stage.removeChild(this.sprite);
		}

		this.angle = Math.atan2(this.xs,-this.ys);
		
		this.updateSprite();
	}
});