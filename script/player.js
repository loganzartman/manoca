"use strict";

/**
 * The player class.
 * @param props props
 */
var Player = Entity.extend(function(props){
	this.leftGun = new GunMount(this, new PIXI.Point(0.5,0.1));
	this.rightGun = new GunMount(this, new PIXI.Point(0.5,0.9));
	this.guns = new GunCycler([this.leftGun, this.rightGun], BasicLaser.delay/2);

	this.sprite.depth = 1001;

	Graphics.addEngineFire(this, "engineFire");
	Graphics.stage.addChild(this.sprite);
})
.statics({
	texture: PIXI.Texture.fromImage("img/playerShip2_red.png"),
	accel: 3,
	top: 30,
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
		if (Input.movementMode === Input.modes.KEYBOARD) {
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
		}
		else if (Input.movementMode === Input.modes.MOUSE) {
			var dist = this.distanceTo({
				"x": Input.mouseX,
				"y": Input.mouseY
			});
			var dir = this.directionTo({
				"x": Input.mouseX,
				"y": Input.mouseY
			});
			var dx = Math.cos(dir),
			    dy = Math.sin(dir);

			var md = 100;
		 	this.xs += dx*Math.min(dist/md,md)*Player.accel;
		 	this.ys += dy*Math.min(dist/md,md)*Player.accel;
		}

		this.engineFire.scale = 1+(this.xs/Player.top)

		//speed limiter
		if (Math.abs(this.ys)>Player.top) {
			this.ys = sign(this.ys)*Player.top;
		}
		if (Math.abs(this.xs)>Player.top) {
			this.xs = sign(this.xs)*Player.top;
		}

		//soft boundaries
		if (this.x>Graphics.width/(3/2)) {
			this.x -= (this.x-Graphics.width/(3/2))/10;
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
		if (Input.key(Input.VK_SPACE) || Input.mouseLeft) {
			this.guns.fire(BasicLaser);
		}

		var rand = new Random();
		for (var i=0; i<3; i++) {
			Game.particles.push(new TrailSmoke({
				x: this.x-(this.sprite.width/2)*(1+(i+1)/3)+rand.next(-10,10),
				y: this.y+rand.next(-10,10),
				xs: rand.next(-5,-4.5),
				ys: rand.next(-1,1),
				texture: Particle.textureSmoke
			}));
		}

		
		this.updateSprite();
	},
	kill: function() {

	}
});