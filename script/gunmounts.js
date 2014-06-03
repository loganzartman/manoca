"use strict";

var GunMount = klass(function(ship,anchorPoint){
	this.ship = ship;
	this.anchorPoint = anchorPoint;
	this.lastFire = Date.now();
})
.methods({
	fire: function(LaserType){
		if (Date.now()-this.lastFire >= LaserType.delay) {
			var rnd = new Random();
			var rc = LaserType.recoil*(Math.PI/180);

			var xs = Math.cos(this.ship.angle+rnd.next(-rc,rc))*LaserType.speed,
				ys = Math.sin(this.ship.angle+rnd.next(-rc,rc))*LaserType.speed;

			var laser = new LaserType({
				"x": this.ship.x + (this.anchorPoint.x-this.ship.sprite.anchor.x)*this.ship.sprite.height,
				"y": this.ship.y + (this.anchorPoint.y-this.ship.sprite.anchor.y)*this.ship.sprite.width,
				"xs": xs,
				"ys": ys,
				"texture": LaserType.texture,
				"shooter": this.ship
			});

			Game.entities.push(laser);

			this.lastFire = Date.now();
			return true;
		}
		return false;
	}
});

var GunCycler = klass(function(gunMounts, delay){
	this.gunMounts = gunMounts;
	this.delay = delay;
	this.lastFire = Date.now();
	this.ind = 0;
})
.methods({
	fire: function(LaserType) {
		if (Date.now() - this.lastFire >= this.delay) {
			if (this.gunMounts[this.ind].fire(LaserType)) {
				this.ind = (this.ind+1)%this.gunMounts.length;
				this.lastFire = Date.now();
			}
		}
	}
});