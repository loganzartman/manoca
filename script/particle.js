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
	this.easeIn = params.easeIn||false;
	this.easeOut = params.easeOut||true;

	var texture = params.texture||Particle.textureSmoke;
	this.sprite = new PIXI.Sprite(texture);
	this.sprite.blendMode = PIXI.blendModes.NORMAL;
	this.sprite.anchor = new PIXI.Point(0.5,0.5);
	this.updateSprite();
	this.sprite.depth = 1000;
	Graphics.stage.addChild(this.sprite);
})
.statics({
	textureSmoke: PIXI.Texture.fromImage("img/part2.png"),

	emitExplosion: function(params) {
		var x = params.x||0;
		var y = params.y||0;
		var n = params.n||1;

		var r = new Random();
		for (var i=n; i>=0; i--) {
			Game.particles.push(new Explosion({
				"x": x,
				"y": y,
				"xs": r.next(-10,10),
				"ys": r.next(-10,10),
				"scale": r.next(0.5,1)
			}));			
		}

		for (var i=n/2; i>=0; i--) {
			Game.particles.push(new Smoke({
				"x": x+r.next(-50,50),
				"y": y+r.next(-50,50),
				"xs": r.next(-2,2),
				"ys": r.next(-2,2),
				"life": 100,
				"scale": r.next(1,3),
				"friction": r.next(0.01,0.06)
			}));
		}
	}
})
.methods({
	updateSprite: function() {
		this.t++;
		this.sprite.position = new PIXI.Point(
			this.x,
			this.y
		);
		this.sprite.scale = new PIXI.Point(this.scale,this.scale);
		this.sprite.rotation = this.angle;

		//transparency easing
		if (this.easeIn && this.t<this.life/2) {
			this.sprite.alpha = Util.easeInCubic(
				this.t,
				0,
				1,
				this.life/2
			);
		}
		else if (this.easeOut) {
			this.sprite.alpha = 1-Util.easeOutCubic(
				this.t-this.life/2,
				0,
				1,
				this.life/2
			);	
		}
		else {
			this.sprite.alpha = 1;
		}
	},

	step: function() {
		this.updateSprite();
		this.supr();
		this.xs -= 0.2;

		if (!this.inBounds(Graphics.getBounds()) || this.t>this.life) {
			this.destroy();
		}
	},

	destroy: function() {
		Game.particles.splice(Game.particles.indexOf(this),1);
		Graphics.stage.removeChild(this.sprite);
	}
});