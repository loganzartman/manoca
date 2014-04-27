"use strict";

var Hostile = Entity.extend(function(props){

})
.methods({
	step: function() {
		this.supr();
		if (!this.inBounds({"x1": 0})) {
			this.destroy();
		}

		for (var i = Game.entities.length - 1; i >= 0; i--) {
			var e = Game.entities[i];
			if (e instanceof Bullet) {
				if (this.collidesCircles(e)) {
					this.damagedBy(e);
					e.destroy();
					break;
				}
			}
		}
	},

	damagedBy: function(obj) {
		Game.particles.push(new Explosion({
			"x": obj.x||this.x,
			"y": obj.y||this.y,
			"scale": 0.2
		}));
		this.health -= obj.damage||1;
	},

	kill: function() {
		Particle.emitExplosion({
			"x": this.x,
			"y": this.y,
			"n": 20
		});
		this.destroy();
	}
});