"use strict";

var Particle = Entity.extend(function(params){
	this.type = "Particle";
	this.system = params.system||null; //this should be passed by the particle system
	this.x = params.x||0;
	this.y = params.y||0;
	this.xs = params.xs||0;
	this.ys = params.ys||0;

	this.angle = params.angle||0;
	this.t = 0;
	this.life = params.life||200;
	this.scale = params.scale||1;
	this.friction = params.friction||0;

	this.alpha = params.alpha||1;

	this.tweenPoint = either(params.tweenPoint,0.5);
	this.tweens = either(params.tweens,[
		{ //begin (t<tweenPoint)
			"alpha": 1,
			"scale": 1
		},
		{ //mid (t==tweenPoint)
			"alpha": 1,
			"scale": 1
		},
		{ //end (t>tweenPoint)
			"alpha": 0,
			"scale": 0
		}
	]);

	var texture = params.texture||Particle.textureSmoke;
	this.sprite = new PIXI.Sprite(texture);
	this.sprite.blendMode = PIXI.blendModes.NORMAL;
	this.sprite.anchor = new PIXI.Point(0.5,0.5);
	this.updateSprite();
	this.sprite.depth = 1001;
	Graphics.stage.addChild(this.sprite);
})
.statics({
	textureSmoke: PIXI.Texture.fromImage("img/part2.png"),

	/**
	 * Create a fiery explosion.
	 * @param x x position
	 * @param y y position
	 * @param n number of particles
	 * @param s multiplier
	 */
	emitExplosion: function(params) {
		var x = params.x||0;
		var y = params.y||0;
		var n = params.n||1;
		var s = typeof params.s === "number" ? params.s : 1;

		var r = new Random();
		for (var i=n; i>=0; i--) {
			var dir = Random.next(Math.PI*2);
			var len = Random.next(-8,8)*s;
			Game.particleSystem.emit({
				"type": "Explosion",
				"x": x,
				"y": y,
				"xs": Math.cos(dir)*len,
				"ys": Math.sin(dir)*len,
				"life": r.next(10,20),
				"scale": r.next(0.8,1.2)*s,
				"depth": Math.random()>0.5?1001:1002
			});		
		}

		for (var i=n/2; i>=0; i--) {
			var dir = Random.next(Math.PI*2);
			var len = Random.next(-4,4)*s;
			Game.particleSystem.emit({
				"type": "Smoke",
				"x": x+r.next(-50,50),
				"y": y+r.next(-50,50),
				"xs": Math.cos(dir)*len,
				"ys": Math.sin(dir)*len,
				"life": r.next(40,80),
				"scale": r.next(1,1)*s,
				"tint": 0x333333,
				"friction": r.next(0.01,0.06),
				"depth": Math.random()>0.5?1001:1002
			});
		}
	}
})
.methods({
	/**
	 * Update the particle's sprite.
	 * Generally called once per frame by particle's step method.
	 */
	updateSprite: function() {
		this.t++;
		
		//tweening
		if (this.tweens.length === 3) {
			var time = this.t/this.life;
			var mid = this.tweenPoint;

			for (var prop in this.tweens[1]) {
				this[prop] = Util.tween(time,mid,this.tweens[0][prop],this.tweens[1][prop],this.tweens[2][prop]);
			}
		}

		this.sprite.position = new PIXI.Point(
			this.x,
			this.y
		);
		this.sprite.scale = new PIXI.Point(this.scale,this.scale);
		this.sprite.alpha = this.alpha;
		this.sprite.rotation = this.angle;
		if (typeof this.red !== "undefined") this.sprite.tint = PIXI.rgb2hex([this.red/255,this.green/255,this.blue/255]);
	},

	/**
	 * Step the particle.
	 * Includes physics, sprite updates, etc.
	 * Called once per frame by particle system.
	 */
	step: function() {
		this.updateSprite();
		this.supr();
		this.xs -= 0.2; //this is very bad, move this

		if (!this.inBounds(Graphics.getBounds()) || this.t>this.life) {
			this.destroy();
		}
	},

	/**
	 * Remove the particle from game objects array and PIXI stage.
	 * Must not be called more than once.
	 */
	destroy: function() {
		this.system.destroy(this);
	}
});