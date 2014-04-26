"use strict";

/**
 * The player class.
 * @param props props
 */
var Player = Entity.extend(function(props){
	this.leftGun = new GunMount(this, new PIXI.Point(0.5,0.1));
	this.rightGun = new GunMount(this, new PIXI.Point(0.5,0.9));
	this.guns = new GunCycler([this.leftGun, this.rightGun], BasicLaser.delay/2);

	this.sprite.depth = 1000;

	Graphics.addEngineFire(this, "engineFire");
	Graphics.stage.addChild(this.sprite);
})
.statics({
	texture: PIXI.Texture.fromImage("img/playerShip2_red.png"),
	accel: 3,
	top: 20,
	friction: 8/7
})
.methods({
	updateSprite: function() {
		this.supr();
		this.engineFire.updateSprite();
	},
	step: function() {
		this.supr();
		
		//movement
		if (Input.key(Input.VK_UP)) {
			this.ys-=Player.accel;
		}
		else if (Input.key(Input.VK_DOWN)) {
			this.ys+=Player.accel;
		}
		if (Input.key(Input.VK_LEFT)) {
			this.xs-=Player.accel;
			this.engineFire.scale = 0.7;
		}
		else if (Input.key(Input.VK_RIGHT)) {
			this.xs+=Player.accel;
			this.engineFire.scale = 1.5;
		}
		else {
			this.engineFire.scale = 1;
		}

		//speed limiter
		if (Math.abs(this.ys)>Player.top) {
			this.ys = sign(this.ys)*Player.top;
		}
		if (Math.abs(this.xs)>Player.top) {
			this.xs = sign(this.xs)*Player.top;
		}

		//soft boundaries
		if (this.x>Graphics.width/2) {
			this.x -= (this.x-Graphics.width/2)/10;
		}
		else if (this.x<this.sprite.width) {
			this.x += (this.sprite.width-this.x)/5;
		}
		if (this.y>Graphics.height-this.sprite.height) {
			this.y -= (this.y-(Graphics.height-this.sprite.height))/5;
		}
		else if (this.y<this.sprite.height) {
			this.y += (this.sprite.height-this.y)/5;
		}

		//friction
		this.xs /= Player.friction;
		this.ys /= Player.friction;

		this.angle = Math.PI/2+(this.ys/Player.top)*Math.PI/7;

		//guns
		if (Input.key(Input.VK_SPACE)) {
			this.guns.fire(BasicLaser);
		}

		this.updateSprite();
	},
	kill: function() {

	}
});