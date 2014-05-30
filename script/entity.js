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
	/**
	 * Updates position/etc of this entity's sprite.
	 * Called by step function.
	 */
	updateSprite: function() {
		this.sprite.position = new PIXI.Point(
			this.x,
			this.y
		);
		this.sprite.rotation = this.angle;
	},

	/**
	 * Step this entity.
	 * Moves, applies friction, and then checks health.
	 * Calls kill function if health is <= 0.
	 */
	step: function() {
		this.x += this.xs;
		this.y += this.ys;
		this.xs *= (1-this.friction);
		this.ys *= (1-this.friction);

		if (this.health<=0 && typeof this.kill === "function") {
			this.kill();
		}
	},

	/**
	 * Checks to see if this entity's sprite is at least partially in bounds.
	 * @param bounds an object with properties x1, y1, x2, and y2 representing a bounding rectangle.
	 * @returns true or false, depending on whether this entity is in bounds.
	 */
	inBounds: function(bounds) {
		return (this.x>=bounds.x1-this.sprite.width*0.5 || typeof bounds.x1 === "undefined") &&
		       (this.y>=bounds.y1-this.sprite.height*0.5 || typeof bounds.y1 === "undefined") &&
		       (this.x<=bounds.x2+this.sprite.width*0.5 || typeof bounds.x2 === "undefined") &&
		       (this.y<=bounds.y2+this.sprite.height*0.5 || typeof bounds.y2 === "undefined");
	},

	/**
	 * Gets the distance to another object.
	 * @param ent an object with properties x and y.
	 * @returns the distance to ent (in px)
	 */
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

	/**
	 * Gets the direction of the vector from this entity to ent.
	 * @param ent an object with properties x and y
	 * @returns angle in radians to ent
	 */
	directionTo: function(ent) {
		if (typeof ent.x !== "undefined" && typeof ent.y !== "undefined") {
			var dx = ent.x-this.x,
			    dy = ent.y-this.y;
			var dir = Math.atan2(dy,dx);
			return dir;
		}
		else {
			throw new Error("directionTo error: Object must have x/y coords!");
		}
	},

	/**
	 * Performs a distance-based collision check between this entity and ent using
	 * the sum of the entities' sprites' radii as the collision distance.
	 * Ie. checks to see if entities' sprites collide with circular collision masks.
	 * @param ent entity to check for collision with
	 * @returns true or false depending on whether or not a collision is occurring
	 */
	collidesCircles: function(ent) {
		var dist = this.distanceTo(ent);
		if (typeof ent.sprite !== "undefined") {
			return dist < this.sprite.width/2 + ent.sprite.width/2;
		}
		else {
			throw new Error("collidesCircles error: Object must have a sprite!");
		}
	},

	/**
	 * Removes this entity from Game.entities and remove its sprite from the PIXI stage.
	 * Only attempts to destroy the entity if it exists in Game.entities.
	 */ 
	destroy: function() {
		var ind = Game.entities.indexOf(this);
		var cin = Graphics.stage.children.indexOf(this.sprite);
		if (ind >= 0 && cin >= 0) {
			Game.entities.splice(ind,1);
			Graphics.stage.removeChild(this.sprite);
		}
	}
});