"use strict";

var BasicLaser = Bullet.extend(function(props){
	this.shooter = either(props.shooter, null);
	this.emitFire = false;

	this.sprite.scale = new PIXI.Point(Graphics.width,0.5);
	this.sprite.blendMode = PIXI.blendModes.ADD;
	this.sprite.depth = 50;
	this.sprite.anchor = new PIXI.Point(0.0,0.5);
	this.angle = either(props.angle, 0);
	this.sprite.depth = 1000;
	this.updateSprite();
	Graphics.stage.addChild(this.sprite);

	this.glow = new PIXI.Sprite(BasicLaser.glowtexture);
	this.glow.tint = 0xEEA016;
	this.glow.position = new PIXI.Point(0,0);
	this.glow.anchor = new PIXI.Point(0,0.5);
	this.glow.blendMode = PIXI.blendModes.ADD;
	this.sprite.addChild(this.glow);

	this.sound = "laser";

	this.t = 0;
	this.life = BasicLaser.life;

	this.sdx = this.shooter.x-this.x;
	this.sdy = this.shooter.y-this.y;
	this.sda = this.shooter.angle-this.angle;

	this.damage = BasicLaser.damage;
	this.piercing = true;
	this.collisionResolution = 8;
	this.collisions = [];
})
.statics({
	texture: PIXI.Texture.fromImage("img/laser-core.png"),
	glowtexture: PIXI.Texture.fromImage("img/laser-glow.png"),
	delay: 15,
	damage: 3,
	speed: 1,
	recoil: 0,
	life: 5,

	getDPS: function() {
		return this.damage*this.life*60/this.delay;
	}
})
.methods({
	updateSprite: function() {
		this.sprite.position = new PIXI.Point(
			this.x,
			this.y
		);
		this.sprite.rotation = this.angle;
		this.sprite.alpha = 2-(this.t*2/this.life);
	},

	collides: function(entity) {
		return this.collisions.indexOf(entity)>=0;
	},

	raycast: function() {
		var n = this.sprite.width/this.collisionResolution;
		var recast = false;
		for (var i=1; i<=n; i++) {
			var x = this.x + Math.cos(this.angle) * (i*this.collisionResolution),
				y = this.y + Math.sin(this.angle) * (i*this.collisionResolution);
			
			var pos = 1-Util.easeOutCubic(i, 0, 1, n);
			if (this.t===0 && Math.random()<0.3*(pos))
			Game.particleSystem.emit({
				"type": "EngineFlare",
				"x": x,
				"y": y,
				"xs": Random.next(-4,4)*pos,
				"ys": Random.next(-4,4)*pos,
				"tweens": [
					{
						"alpha": 1,
						"scale": 0.8*pos+0.1
					},
					{
						"alpha": 0.5,
						"scale": 0.1
					},
					{
						"alpha": 0,
						"scale": 0
					}
				],
				"tint": this.glow.tint,
				"life": this.life*5
			});

			for (var j = Game.entities.length - 1; j >= 0; j--) {
				if (Game.entities[j] instanceof Hostile && !Game.entities[j].dead) {
					var dx = Game.entities[j].x - x,
						dy = Game.entities[j].y - y;
					if (Math.sqrt(dx*dx+dy*dy)<this.collisionResolution + Game.entities[j].collisionMask.width/2) {
						this.collisions.push(Game.entities[j]);
						Game.particleSystem.emit({
							"type": "EngineFlare",
							"x": x,
							"y": y,
							"xs": Random.next(-4,4),
							"ys": Random.next(-4,4),
							"tint": this.glow.tint,
							"life": this.life*3,
							"count": 2
						});
						this.sprite.width = i*this.collisionResolution;
						return;
					}
				}
			}
			if (i===n && !recast) {
				recast = true;
				i=0;
				n=Graphics.width/this.collisionResolution;
			} 
		}
		this.sprite.width = i*this.collisionResolution;
	},

	step: function() {
		this.supr();

		this.collisions = [];
		this.raycast();

		this.x = this.shooter.x-this.sdx;
		this.y = this.shooter.y-this.sdy;
		this.angle = this.shooter.angle-this.sda;

		this.updateSprite();
		if (this.t++>this.life) {this.destroy();}
	}
});