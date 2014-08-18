"use strict";

var GunMount = klass(function(type,anchorPoint){
	this.type = type;
	this.anchorPoint = anchorPoint;
	this.lastFire = Date.now();
})
.methods({
	fire: function(ship){
		if (Date.now()-this.lastFire >= this.type.delay) {
			var rnd = new Random();
			var rc = this.type.recoil*(Math.PI/180);

			var xs = Math.cos(ship.angle+rnd.next(-rc,rc))*this.type.speed,
				ys = Math.sin(ship.angle+rnd.next(-rc,rc))*this.type.speed;

			var laserPoint = Util.rotatePoint(this.anchorPoint, ship.sprite.anchor, ship.angle);

			var laser = new this.type({
				"x": ship.x + (laserPoint.x-ship.sprite.anchor.x)*ship.sprite.height,
				"y": ship.y + (laserPoint.y-ship.sprite.anchor.y)*ship.sprite.width,
				"xs": xs,
				"ys": ys,
				"texture": this.type.texture,
				"shooter": ship
			});

			//sound
			if (typeof laser.sound !== "undefined") {
				var snd = Sound.play(laser.sound, 0.3);
				var spx,spy;
				if (ship === Game.player) {
					spx = this.anchorPoint.y-0.5;
					spy = this.anchorPoint.x-0.5;
				}
				else {
					spx = (ship.y-Game.player.y)/Graphics.height;
					spy = (ship.x-Game.player.x)/Graphics.width;
				}
				snd.pos3d(
					spx,
					spy,
					0.5
				);
			}

			Game.entities.push(laser);

			this.lastFire = Date.now();
			return true;
		}
		return false;
	}
});

var GunCycler = klass(function(ship, gunMounts){
	this.ship = ship;
	this.gunMounts = gunMounts;
	this.mode = GunCycler.modes.STAGGER;
	
	this.generateGroups();

	this.lastFire = Date.now();
	this.ind = 0;
})
.statics({
	modes: {
		"STAGGER": 0,
		"SYNC": 1
	}
})
.methods({
	add: function(mount) {
		var ind = this.gunMounts.push(mount);
		this.generateGroups();
		return ind;
	},

	remove: function(index) {
		var mount = this.gunMounts.splice(index,1);
		this.generateGroups();
		return mount;
	},

	toggleMode: function() {
		this.mode = 1-this.mode;
		UIFactory.showStatus({
			"text": "FIRE MODE: "+["STAGGER","SYNC"][this.mode],
			"timeout": 1000
		});
	},

	generateGroups: function() {
		this.groups = {};
		for (var item in this.gunMounts) {
			if (this.gunMounts.hasOwnProperty(item)) {
				var mount = this.gunMounts[item];
				if (!(this.groups[mount.type.delay] instanceof Array)) {
					this.groups[mount.type.delay] = [mount];
					this.groups[mount.type.delay].ind = 0;
					this.groups[mount.type.delay].lastFire = 0;
				}
				else {
					this.groups[mount.type.delay].push(mount);
				}
			}
		}
	},

	fire: function() {
		for (var delay in this.groups) {
			if (this.groups.hasOwnProperty(delay)) {
				var group = this.groups[delay];

				switch (this.mode) {
					case GunCycler.modes.STAGGER:
						if (Game.time - group.lastFire >= delay/group.length) {
							group.lastFire = Game.time;
							group[group.ind].fire(this.ship);
							group.ind = (group.ind+1)%group.length;
						}
					break;

					case GunCycler.modes.SYNC:
						if (Game.time - group.lastFire >= delay) {
							group.lastFire = Game.time;
							for (var i = group.length - 1; i >= 0; i--) {
								group[i].fire(this.ship);
							}
						}
					break;
				}
			}
		}
	}
});