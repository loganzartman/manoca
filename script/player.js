"use strict";

/**
 * The player class.
 * @param props props
 */
var Player = Entity.extend(function(props){
	this.leftGun = new GunMount(this, new PIXI.Point(0.5,0.1));
	this.rightGun = new GunMount(this, new PIXI.Point(0.5,0.9));
	this.guns = new GunCycler([this.leftGun, this.rightGun], BasicLaser.delay/2, this);

	this.accel = either(props.accel, 3);
	this.top = either(props.top, 30);
	this.fric = either(props.friction, 8/7); //note this is not entity friction!
	this.texture = either(props.texture, Player.texture);

	this.sprite.depth = 1000;

	Graphics.addEngineFire(this, "engineFire");
	Graphics.stage.addChild(this.sprite);
})
.statics({
	texture: PIXI.Texture.fromImage("img/playerShip2_red.png"),
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
				this.ys-=this.accel;
			}
			else if (Input.key(Input.VK_DOWN)) {
				this.ys+=this.accel;
			}
			if (Input.key(Input.VK_LEFT)) {
				this.xs-=this.accel;
				this.engineFire.scale = 0.7;
			}
			else if (Input.key(Input.VK_RIGHT)) {
				this.xs+=this.accel;
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
		 	this.xs += dx*Math.min(dist/md,md)*this.accel;
		 	this.ys += dy*Math.min(dist/md,md)*this.accel;
		}

		this.engineFire.scale = 1+(this.xs/this.top)

		//speed limiter
		if (Math.abs(this.ys)>this.top) {
			this.ys = sign(this.ys)*this.top;
		}
		if (Math.abs(this.xs)>this.top) {
			this.xs = sign(this.xs)*this.top;
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
		this.xs /= this.fric;
		this.ys /= this.fric;

		this.angle = (this.ys/this.top)*Math.PI/7;

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
		if (!this.dead) {
			this.dead = true;
			Game.end();
		}
	},
	damagedBy: function(obj) {
		if (obj instanceof Bullet && !(obj.shooter instanceof Player)) {
			//todo: actually use player health
			this.kill();
			return true;
		}
		return false;
	}
});