"use strict";

var Particle = Entity.extend(function(params){
	this.x = params.x||0;
	this.y = params.y||0;
	this.xs = params.xs||0;
	this.ys = params.ys||0;

	this.angle = params.angle||0;
	this.t = 0;
	this.life = params.life||200;
	this.scale = params.scale||1;
	this.friction = params.friction||0;

	this.minAlpha = params.minAlpha||0;
	this.maxAlpha = params.maxAlpha||1;
	this.easeTime = params.easeTime||1;
	this.easeIn = params.easeIn||false;
	this.easeOut = params.easeOut||true;

	var texture = params.texture||Particle.textureSmoke;
	this.sprite = new PIXI.Sprite(texture);
	this.sprite.blendMode = PIXI.blendModes.NORMAL;
	this.sprite.anchor = new PIXI.Point(0.5,0.5);
	this.updateSprite();
	this.sprite.depth = 10;
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
			Game.particles.push(new Explosion({
				"x": x,
				"y": y,
				"xs": r.next(-10,10)*s,
				"ys": r.next(-10,10)*s,
				"life": r.next(10,40),
				"scale": r.next(0.2,0.5)*s
			}));			
		}

		for (var i=n*4; i>=0; i--) {
			Game.particles.push(new Smoke({
				"x": x+r.next(-50,50),
				"y": y+r.next(-50,50),
				"xs": r.next(-3,3)*s,
				"ys": r.next(-3,3)*s,
				"life": r.next(40,80),
				"scale": r.next(1,10)*s,
				"tint": 0x333333,
				"friction": r.next(0.01,0.06),
				"easeIn": false
			}));
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
		this.sprite.position = new PIXI.Point(
			this.x,
			this.y
		);
		this.sprite.scale = new PIXI.Point(this.scale,this.scale);
		this.sprite.rotation = this.angle;

		//transparency easing
		if (this.easeIn && this.t<this.life*0.5*this.easeTime) {
			this.sprite.alpha = Util.easeInCubic(
				this.t,
				this.minAlpha,
				this.maxAlpha,
				this.life*0.5*this.easeTime
			);
		}
		else if (this.easeOut && this.t>this.life-this.life*0.5*this.easeTime) {
			this.sprite.alpha = this.maxAlpha-Util.easeOutCubic(
				this.t-this.life*0.5,
				this.minAlpha,
				this.maxAlpha,
				this.life*0.5*this.easeTime
			);	
		}
		else {
			this.sprite.alpha = this.maxAlpha;
		}
	},

	/**
	 * Step the particle.
	 * Includes physics, sprite updates, etc.
	 * Called once per frame by game loop.
	 */
	step: function() {
		this.updateSprite();
		this.supr();
		this.xs -= 0.2;

		if (!this.inBounds(Graphics.getBounds()) || this.t>this.life) {
			this.destroy();
		}
	},

	/**
	 * Remove the particle from game objects array and PIXI stage.
	 * Must not be called more than once.
	 */
	destroy: function() {
		Game.particles.splice(Game.particles.indexOf(this),1);
		Graphics.stage.removeChild(this.sprite);
	}
});