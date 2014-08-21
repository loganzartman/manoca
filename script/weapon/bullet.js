"use strict";

var Bullet = Entity.extend(function(props){
	this.piercing = false;
	this.emitFire = true;
	this.collisionMask = {
		width: 16,
		height: 16
	};
})
.statics({
	delay: 1,
	damage: 0
})
.methods({
	getDPS: function() {
		return this.damage*60/this.delay;
	},

	collides: function(entity) {
		return this.collidesCircles(entity);
	},

	step: function() {
		this.supr();


		if (this.x<-this.sprite.width/2 || 
			this.y<-this.sprite.height/2 ||
			this.x>Graphics.width+this.sprite.width/2 ||
			this.y>Graphics.height+this.sprite.height/2) 
		{
			Game.entities.splice(Game.entities.indexOf(this),1);
			Graphics.stage.removeChild(this.sprite);
		}


		for (var i = Game.entities.length - 1; i >= 0; i--) {
			var e = Game.entities[i];
			if (e.damagedBy) {
				if (this.collides(e)) {
					if (e.damagedBy(this) && !this.piercing) {
						this.destroy();
					}
					break;
				}
			}
		}
	}
});