"use strict";

/**
 * The player class.
 * @param props props
 */
var Player = Entity.extend(function(props){
	this.guns = new GunCycler(this, props.mounts, BoraLaser.delay/2);

	this.accel = either(props.accel, 3);
	this.top = either(props.top, 30);
	this.fric = either(props.fric, 8/7); //note this is not entity friction!
	this.texture = either(props.texture, Player.texture);
	this.srot = either(props.srot, 3/8);
	this.flameColor = either(props.flameColor, 0xFF6510);

	this.sprite.depth = 1000.1;

	Graphics.addEngineFire(this, "engineFire");
	//this.engineFire.sprite.tint = this.flameColor;
	this.engineFire.light.tint = this.flameColor;
	Graphics.stage.addChild(this.sprite);
})
.statics({
	texture: PIXI.Texture.fromImage("img/playerShip2_red.png"),
	ships: [
		{
			"name": "Pegasus",
			"texture": PIXI.Texture.fromImage("img/playerShip2_blue.png"),
			"flameColor": 0x2244FF,
			"accel": 3,
			"top": 30,
			"fric": 8/7,
			"srot": 3/8,
			"mounts": [
				new GunMount(BasicLaser, new PIXI.Point(0.5, 0.1)),
				new GunMount(BasicLaser, new PIXI.Point(0.5, 0.9))
			]
		},
		{
			"name": "Javelin",
			"texture": PIXI.Texture.fromImage("img/playerShip1_orange.png"),
			"flameColor": 0x30FF10,
			"accel": 4,
			"top": 25,
			"fric": 8/7,
			"srot": 1/2,
			"mounts": [
				new GunMount(BoraLaser, new PIXI.Point(0.5, 0.1)),
				new GunMount(BoraLaser, new PIXI.Point(0.5, 0.9))
			]
		},
		{
			"name": "Myrmidon",
			"texture": PIXI.Texture.fromImage("img/constellation.png"),
			"flameColor": 0xFF6510,
			"accel": 1,
			"top": 25,
			"fric": 17/14,
			"srot": 1/7,
			"mounts": [
				new GunMount(DeimosLaser, new PIXI.Point(0.5, 0.5)),
				new GunMount(BasicLaser, new PIXI.Point(0.5, 0.1)),
				new GunMount(BasicLaser, new PIXI.Point(0.5, 0.9))
			]
		}
	]
})
.methods({
	updateSprite: function() {
		this.supr();
		this.engineFire.updateSprite();
	},
	step: function() {
		this.supr();
		
		//movement
		if (!Input.key(Input.VK_Q)) { //slide
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
		}

		this.engineFire.scale = Input.key(Input.VK_Q)?0:1+(this.xs/this.top);

		//speed limiter
		if (Math.abs(this.ys)>this.top) {
			this.ys = sign(this.ys)*this.top;
		}
		if (Math.abs(this.xs)>this.top) {
			this.xs = sign(this.xs)*this.top;
		}

		//soft boundaries
		var boundEffects = new PIXI.Point(0,0);
		if (this.x>Graphics.width/(3/2)) {
			var val = (this.x-Graphics.width/(3/2))/10;
			boundEffects = new PIXI.Point(boundEffects.x-val,boundEffects.y);
			this.x -= val;
		}
		else if (this.x<this.sprite.width) {
			var val = (this.sprite.width-this.x)/5;
			boundEffects = new PIXI.Point(boundEffects.x+val,boundEffects.y);
			this.x += val;
		}
		if (this.y>Graphics.height-this.sprite.height) {
			var val = (this.y-(Graphics.height-this.sprite.height))/5;
			boundEffects = new PIXI.Point(boundEffects.x,boundEffects.y-val);
			this.y -= val;
		}
		else if (this.y<this.sprite.height) {
			var val = (this.sprite.height-this.y)/5;
			boundEffects = new PIXI.Point(boundEffects.x,boundEffects.y+val);
			this.y += val;
		}

		//friction
		var slidePhysicsFriction = Input.key(Input.VK_Q)?0.5:1;
		this.xs /= (this.fric-1)*slidePhysicsFriction+1;
		this.ys /= (this.fric-1)*slidePhysicsFriction+1;

		var targetAngle;
		if (!Input.key(Input.VK_Q)) {
			targetAngle = (this.ys/this.top)*Math.PI/5;
		}
		else {
			targetAngle = this.directionTo({x: Input.mouseX, y: Input.mouseY});
		}

		//angle smoothing
		var acx = Math.cos(this.angle);
		var acy = Math.sin(this.angle);
		var atx = Math.cos(targetAngle)*this.srot;
		var aty = Math.sin(targetAngle)*this.srot;
		var newangle = Math.atan2(acy+aty, acx+atx);
		this.angle = newangle;

		//guns
		if (Input.key(Input.VK_SPACE) || Input.mouseLeft) {
			this.guns.fire();
		}

		if (!Input.key(Input.VK_Q)) {
			var rand = new Random();
			for (var i=0; i<3; i++) {
				Game.particleSystem.emit({
					"type": "TrailSmoke",
					"x": this.x-(this.sprite.width/2)*(1+(i+1)/3)+rand.next(-10,10),
					"y": this.y+rand.next(-10,10),
					"xs": rand.next(-5,-4.5),
					"ys": rand.next(-1,1),
					"texture": Particle.textureSmoke
				});

				var flarePoint = Util.rotatePoint(new PIXI.Point(
					(this.sprite.width/2)*(1+(i+1)/3)+rand.next(-5*(this.xs/this.top),5*(this.xs/this.top)),
					rand.next(-2,2)
				), this.sprite.anchor, this.angle);
				Game.particleSystem.emit({
					"type": "EngineFlare",
					"x": this.x-flarePoint.x,
					"y": this.y-flarePoint.y,
					"xs": rand.next(-20,-10)+this.xs+boundEffects.x,
					"ys": rand.next(-1,1),
					"tint": this.flameColor
				});
			}
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
		if (obj instanceof Bullet && !(obj.shooter instanceof Player) && !Game.debugMode) {
			//todo: actually use player health
			this.kill();
			return true;
		}
		return false;
	}
});