"use strict";

/**
 * Simple base class for all entities
 */
var Entity = klass(function(props){
	this.x = props.x||0;
	this.y = props.y||0;
	this.xs = props.xs||0;
	this.ys = props.ys||0;
	this.friction = props.friction||0;
	this.sprite = props.texture ? new PIXI.Sprite(props.texture) : {};
	this.sprite.anchor = new PIXI.Point(0.5,0.5);
	this.angle = 0;
	this.health = 100;
})
.methods({
	updateSprite: function() {
		this.sprite.position = new PIXI.Point(
			this.x,
			this.y
		);
		this.sprite.rotation = this.angle;
	},
	step: function() {
		this.x += this.xs;
		this.y += this.ys;
		this.xs *= (1-this.friction);
		this.ys *= (1-this.friction);

		if (this.health<=0 && typeof this.kill === "function") {
			this.kill();
		}
	},
	inBounds: function(bounds) {
		return (this.x>=bounds.x1-this.sprite.width/2 || typeof bounds.x1 === "undefined") &&
		       (this.y>=bounds.y1-this.sprite.height/2 || typeof bounds.y1 === "undefined") &&
		       (this.x<=bounds.x2+this.sprite.width/2 || typeof bounds.x2 === "undefined") &&
		       (this.y<=bounds.y2+this.sprite.height/2 || typeof bounds.y2 === "undefined");
	},
	distanceTo: function(ent) {
		if (typeof ent.x !== "undefined" && typeof ent.y !== "undefined") {
			var dx = ent.x-this.x,
			    dy = ent.y-this.y;
			var dist = Math.sqrt(dx*dx+dy*dy);
			return dist;
		}
		else {
			throw new Error("distanceTo error: Object must have x/y coords!");
		}
	},
	collidesCircles: function(ent) {
		var dist = this.distanceTo(ent);
		if (typeof ent.sprite !== "undefined") {
			return dist < this.sprite.width/2 + ent.sprite.width/2;
		}
		else {
			throw new Error("collidesCircles error: Object must have a sprite!");
		}
	},
	destroy: function() {
		var ind = Game.entities.indexOf(this);
		if (ind >= 0) {
			Game.entities.splice(ind,1);
			Graphics.stage.removeChild(this.sprite);
		}
	}
});