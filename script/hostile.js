"use strict";

var Hostile = Entity.extend(function(props){
	this.dead = false;
	this.pointValue = 100;
})
.methods({
	step: function() {
		this.supr();

		if (typeof this.tint === "undefined") {
			this.tint = this.sprite.tint;
		}
		if (this.tint !== this.sprite.tint) {
			this.sprite.tint = this.tint;
		}

		if (!this.dead) {
			if (!this.inBounds({"x1": 0})) {
				this.destroy();
			}

			if (this.collidesCircles(Game.player) && !this.dead && !Game.debugMode) {
				this.kill();
				Game.player.kill();
			}
		}
		else {
			Game.particles.push(new Explosion({
				"x": this.x+Random.next(-this.sprite.width/3,this.sprite.width/3),
				"y": this.y+Random.next(-this.sprite.height/3,this.sprite.height/3),
				"scale": 0.01,
				"maxAlpha": 0.7
			}));
			this.xs*=1.02;
			this.ys*=1.02;
		}
	},

	damagedBy: function(obj) {
		if (!this.dead && obj instanceof Bullet && !(obj.shooter instanceof Hostile)) {
			this.sprite.tint = 0xFF2222;
			Game.particles.push(new Explosion({
				"x": obj.x||this.x,
				"y": obj.y||this.y,
				"scale": 0.2
			}));
			this.health -= obj.damage||1;
			return true;
		}
		return false;
	},

	kill: function() {
		if (!this.dead) {
			Game.addScore(this.pointValue);

			Particle.emitExplosion({
				"x": this.x,
				"y": this.y,
				"n": 20
			});

			this.xs *= Random.next(0.5,1.5);
			this.ys *= Random.next(0.5,1.5);

			this.dead = true;
			var that = this;
			setTimeout(function(){
				that.destroy();
				for (var i=0; i<15; i++) {
					Particle.emitExplosion({
						"x": that.x+Random.next(-that.sprite.width/2,that.sprite.width/2),
						"y": that.y+Random.next(-that.sprite.height/2,that.sprite.height/2),
						"n": 1,
						"s": 0.2,
					});
				}
			}, Random.next(500,1000));
		}
	}
});