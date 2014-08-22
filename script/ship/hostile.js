"use strict";

var Hostile = Entity.extend(function(props){
	this.dead = false;
	this.pointValue = 100;
	this.damage = 30;
	this.instantDestroy = true;
	this.soundDestroy = "explode"+(~~Random.next(4));
	Level.hostileCount++;
})
.methods({
	step: function() {
		this.supr();

		if (!this.dead) {
			if (!this.inBounds({"x1": 0})) {
				this.destroy();
			}

			if (this.collidesCircles(Game.player) && !this.dead && !Game.debugMode) {
				this.kill({"nosound": true});
				Game.player.damagedBy(this);
			}
		}
		else {
			Game.particleSystem.emit({
				"type": "Explosion",
				"x": this.x+Random.next(-this.sprite.width/3,this.sprite.width/3),
				"y": this.y+Random.next(-this.sprite.height/3,this.sprite.height/3),
				"scale": 1
			});
			this.xs*=1.02;
			this.ys*=1.02;
		}
	},

	damagedBy: function(obj) {
		if (!this.dead && obj instanceof Bullet && !(obj.shooter instanceof Hostile)) {
			if (obj.emitFire)
			Game.particleSystem.emit({
				"type": "Explosion",
				"x": obj.x||this.x,
				"y": obj.y||this.y,
				"scale": 1
			});
			this.health -= obj.damage||1;
			return true;
		}
		return false;
	},

	kill: function(props) {
		if (!this.dead) {
			
			Game.addScore(this.pointValue);
			var snd = Sound.play(this.soundDestroy);
			
			if (!props || !props.nosound) {
				if (Math.random()<0.1) {
					setTimeout(function(){
						Sound.playIgs();
					}, 100);
				}
			}

			snd.pos3d(
				/*x*/ (this.y-Game.player.y)/Graphics.height,
				/*y*/ (this.x-Game.player.x)/Graphics.width,
				/*z*/ 0.5
			);

			Scrap.make({
				"entity": this,
				"count": ~~Random.next(this.pointValue/40,this.pointValue/20)
			});

			Particle.emitExplosion({
				"x": this.x,
				"y": this.y,
				"n": 20
			});

			var shockwaveScale = (this.sprite.width/64);
			Game.particleSystem.emit({
				"type": "Shockwave",
				"x": this.x,
				"y": this.y,
				"tweens": [
					{
						"alpha": 1,
						"scale": 0
					},
					{
						"alpha": 1,
						"scale": shockwaveScale
					},
					{
						"alpha": 0,
						"scale": shockwaveScale*1.5
					}
				]
			});

			this.xs *= Random.next(0.5,1.5);
			this.ys *= Random.next(0.5,1.5);

			this.dead = true;
			var that = this;
			
			if (this.instantDestroy) {
				this.finishKill(that);
			}
			else {
				setTimeout(function(){that.finishKill(that);}, Random.next(500,1000));
			}
		}
	},

	finishKill: function(that) {
		that.destroy();
		for (var i=0; i<15; i++) {
			Particle.emitExplosion({
				"x": that.x+Random.next(-that.sprite.width/2,that.sprite.width/2),
				"y": that.y+Random.next(-that.sprite.height/2,that.sprite.height/2),
				"n": 1,
				"s": 1
			});
		}
	},

	destroy: function() {
		this.supr();
		Level.hostileCount--;
	}
});