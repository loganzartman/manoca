"use strict";

/**
 * The player class.
 * @param props props
 */
var Player = Entity.extend(function(props){
	this.guns = new GunCycler(this, props.mounts, BoraPlasma.delay/2);

	this.accel = either(props.accel, 3);
	this.top = either(props.top, 30);
	this.fric = either(props.fric, 8/7); //note this is not entity friction!
	this.texture = either(props.texture, Player.texture);
	this.srot = either(props.srot, 3/8);
	this.flameColor = either(props.flameColor, 0xFF6510);
	this.health = this.maxHealth = either(props.health, 100);

	this.snd = Sound.play("engine");
	this.snd.loop(true);
	this.sndh = Sound.play("engineh");
	this.sndh.loop(true);

	this.attractorRange = 300;
	this.attractorStrength = 2;

	this.scrap = 0;

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
			"id": 0,
			"name": "none",
			"cost": 0,
			"texture": Graphics.texture.none,
			"flameColor": 0xFFFFFF,
			"accel": 0,
			"top": 0,
			"fric": 0,
			"srot": 0,
			"mounts": [],
			"health": 0
		},
		{
			"id": 1,
			"name": "Icarus",
			"cost": 0,
			"unlockedDefault": false,
			"texture": PIXI.Texture.fromImage("img/icarus.png"),
			"flameColor": 0xA9A420,
			"accel": 2,
			"top": 20,
			"fric": 8/7,
			"srot": 1/4,
			"mounts": [
				new GunMount(BoraPlasma, new PIXI.Point(0.5, 0.2))
			],
			"health": 70
		},
		{
			"id": 2,
			"name": "Javelin",
			"cost": 10000,
			"unlockedDefault": false,
			"texture": PIXI.Texture.fromImage("img/playerShip1_orange.png"),
			"flameColor": 0x30FF10,
			"accel": 4,
			"top": 40,
			"fric": 8/7,
			"srot": 1/2,
			"mounts": [
				new GunMount(BoraPlasma, new PIXI.Point(0.5, 0.1)),
				new GunMount(BoraPlasma, new PIXI.Point(0.5, 0.9))
			],
			"health": 105
		},
		{
			"id": 3,
			"name": "Pegasus",
			"cost": 24000,
			"unlockedDefault": false,
			"texture": PIXI.Texture.fromImage("img/playerShip2_blue.png"),
			"flameColor": 0x2244FF,
			"accel": 3.5,
			"top": 35,
			"fric": 8/7,
			"srot": 3/8,
			"mounts": [
				new GunMount(BasicPlasma, new PIXI.Point(0.5, 0.1)),
				new GunMount(BasicPlasma, new PIXI.Point(0.5, 0.9))
			],
			"health": 150
		},
		{
			"id": 4,
			"name": "Myrmidon",
			"cost": 42000,
			"unlockedDefault": false,
			"texture": PIXI.Texture.fromImage("img/constellation.png"),
			"flameColor": 0xFF6510,
			"accel": 1,
			"top": 25,
			"fric": 17/14,
			"srot": 1/7,
			"mounts": [
				new GunMount(BasicPlasma, new PIXI.Point(0.5, 0.5)),
				new GunMount(DeimosPlasma, new PIXI.Point(0.5, 0.1)),
				new GunMount(DeimosPlasma, new PIXI.Point(0.5, 0.9))
			],
			"health": 300
		},
		{
			"id": 5,
			"name": "RS-400",
			"cost": 60000,
			"unlockedDefault": false,
			"texture": PIXI.Texture.fromImage("img/rs400.png"),
			"flameColor": 0xA96420,
			"accel": 1.5,
			"top": 35,
			"fric": 8/7,
			"srot": 3/7,
			"mounts": [
				new GunMount(BasicCannon, new PIXI.Point(0.5, 0.15)),
				new GunMount(BasicCannon, new PIXI.Point(0.5, 0.85))
			],
			"health": 245
		},
		{
			"id": 6,
			"name": "Horizon II",
			"cost": 350,
			"unlockedDefault": false,
			"texture": PIXI.Texture.fromImage("img/horizonii.png"),
			"flameColor": 0x1510FF,
			"accel": 4,
			"top": 40,
			"fric": 8/7,
			"srot": 1/2,
			"mounts": [
				new GunMount(BasicLaser, new PIXI.Point(0.5, 0.1)),
				new GunMount(BasicLaser, new PIXI.Point(0.5, 0.9))
			],
			"health": 245
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
		if (!Input.key(Input.VK_Q) && !Starfield.isWarping) { //slide
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
				var md = 100;
				var acc = Math.min(dist/md,md)*this.accel;
				
				var fx = this.xs + Math.cos(dir)*acc,
					fy = this.ys + Math.sin(dir)*acc;

				var fdir = Math.atan2(fy,fx);
				var fspd = Math.min(this.top,Math.sqrt(fx*fx+fy*fy));

			 	this.xs = Math.cos(fdir)*fspd;
			 	this.ys = Math.sin(fdir)*fspd;
			}
		}
		else if (Starfield.isWarping) {
			var dx = (Graphics.width/2 - this.x),
				dy = (Graphics.height/2 - this.y);
			this.x += dx/20;
			this.y += dy/20;
		}
		if (Level.completed && !Starfield.isWarping && Input.key(Input.VK_H)) {
			Starfield.beginWarp();
			Sound.stop("engine");
			Sound.stop("engineh");
			UIFactory.hideStatus();
			setTimeout(function(){
				Game.end();
			},10000);
		}

		this.engineFire.scale = Starfield.warpTime>1?3:Input.key(Input.VK_Q)?0:1+(this.xs/this.top);

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
			targetAngle = Math.atan2(this.ys,this.xs+this.top);
			// targetAngle = (this.ys/this.top)*Math.PI/5;
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
		if (!Starfield.isWarping && (Input.key(Input.VK_SPACE) || Input.mouseLeft)) {
			this.guns.fire();
		}

		if (!Input.key(Input.VK_Q)) {
			var rand = new Random();
			for (var i=0; i<3; i++) {
				
				var flarePoint = Util.rotatePoint(new PIXI.Point(
					(this.sprite.width/2)*(1+(i+1)/3)+rand.next(-5*(this.xs/this.top),5*(this.xs/this.top)),
					rand.next(-2,2)
				), this.sprite.anchor, this.angle);

				if (!Starfield.isWarping)
				Game.particleSystem.emit({
					"type": "TrailSmoke",
					"x": this.x-(this.sprite.width/2)*(1+(i+1)/3)+rand.next(-10,10)-flarePoint.x,
					"y": this.y+rand.next(-10,10)-flarePoint.y,
					"xs": rand.next(-5,-4.5),
					"ys": rand.next(-1,1),
					"texture": Particle.textureSmoke
				});

				var flareSpd = rand.next(-20,-10)*(Starfield.warpTime>1?3:1);
				Game.particleSystem.emit({
					"type": "EngineFlare",
					"x": this.x-flarePoint.x,
					"y": this.y-flarePoint.y,
					"xs": Math.cos(this.angle)*flareSpd+this.xs+boundEffects.x,
					"ys": Math.sin(this.angle)*flareSpd+this.ys+boundEffects.y,
					"tint": this.flameColor
				});
			}
		}

		//sound
		var bal = Math.sqrt(this.xs*this.xs+this.ys*this.ys)/this.top;
		this.snd.volume(1-bal);
		this.sndh.volume(bal);
		
		this.updateSprite();
	},
	kill: function() {
		if (!this.dead) {
			Sound.stop("engine");
			Sound.stop("engineh");
			this.dead = true;
			Game.end();
		}
	},
	damagedBy: function(obj) {
		if (typeof obj.damage !== "undefined" && !(obj.shooter instanceof Player) && !Game.debugMode) {
			this.health -= obj.damage;
			Game.particleSystem.emit({
				"type": "Explosion",
				"x": obj.x||this.x,
				"y": obj.y||this.y,
				"scale": 0.2
			});
			if (this.health<=0) {
				this.kill();
			}
			return true;
		}
		return false;
	}
});