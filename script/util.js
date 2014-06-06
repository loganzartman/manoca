"use strict";

/**
 * This class converts time units to milliseconds.
 * 
 * @class Time
 */
var Time = {
	sec: function(s) {
		return s*1000;
	},

	min: function(s) {
		return Time.sec(s)*60;
	},

	now: function() {
		return Date.now();
	}
};

/**
 * Returns the first thing that is not undefined.
 *
 * @method either
 * @param {Array} arguments the things to choose from
 * @return the first thing that is not undefined
 */
function either(things) {
	for (var i=0; i<arguments.length; i++) {
		if (typeof arguments[i] !== "undefined") {
			return arguments[i];
		}
	}
	return undefined;
}

/**
 * A seedable random number generator.
 * @class Random
 * @constructor
 * @param seed [optional] the seed to use
 */
function Random(seed) {
	this.seed = seed || ~~(Math.random()*10e8);
}

/**
 * Retrieve the next random number with optional min/max params.
 *
 * @method next
 * @param {Number} min lowest value to return (inclusive)
 * @param {Number} max largest value to return
 * @return {Number} a random number
 */
Random.prototype.next = function(min,max) {
	if (typeof min === "number") {
    	if (typeof max !== "number") {
    		max = min;
    		min = 0;
    	}
	}
	else {
		min = 0;
		max = 1;
	}

	var x = Math.sin(this.seed++) * 10000;
    return (x - Math.floor(x))*(max-min)+min;
};
Random.prototype.hexcol = function(rl,rh,gl,gh,bl,bh) {
	return this.next(rl,rh)<<16 +
	       this.next(gl,gh)<<8  +
	       this.next(bl,bh);
};
Random.next = function(min,max) {
	return new Random().next(min,max);
};
Random.hexcol = function(rl,rh,gl,gh,bl,bh) {
	return new Random().hexcol(rl,rh,gl,gh,bl,bh);
};

/**
 * Returns positive 1 or negative 1 (if x is a number) representing the sign of x.
 * @param x a number
 * @return -1 or 1 if x is a number
 */
function sign(x) {
    return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

/**
 * Returns the value of a random index of the array.
 * @return a random value
 */
Array.prototype.random = function() {
	return this[~~(Math.random()*this.length)];
};

/**
 * Concatenates the properties of all arguments into a single object.
 * @param arguments two or more objects to concatenate.
 * @return new object with concatenated properties
 */
Object.collect = function() {
  var ret = {};
  var len = arguments.length;
  for (var i=0; i<len; i++) {
    for (var p in arguments[i]) {
      if (arguments[i].hasOwnProperty(p)) {
        ret[p] = arguments[i][p];
      }
    }
  }
  return ret;
};

var Util = {
	/**
	 * A cubic easing function.
	 * @param t time (0 to d)
	 * @param b initial value
	 * @param c change in value by end
	 * @param d duration of easing
	 * @return result of easing
	 */
	easeInCubic: function (t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},

	/**
	 * A cubic easing function.
	 * @param t time (0 to d)
	 * @param b initial value
	 * @param c change in value by end
	 * @param d duration of easing
	 * @return result of easing
	 */
	easeOutCubic: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},

	/**
	 * A cubic easing function.
	 * @param t time (0 to d)
	 * @param b initial value
	 * @param c change in value by end
	 * @param d duration of easing
	 * @return result of easing
	 */
	easeInOutCubic: function (t, b, c, d) {
		if ((t/=d/2) < 1) {
			return c/2*t*t*t + b;
		}
		else {
			return c/2*((t-=2)*t*t + 2) + b;
		}
	},

	/**
	 * A weird mod function used for starfield.
	 * TODO: figure out what this does.
	 */
	xmod: function(a,b) {return ((a%b)+b)%b;},

	/**
	 * Fast linear interpolation of a value from a to b.
	 * @param a min value
	 * @param b max value
	 * @param f 0 to 1
	 * @return interpolation result
	 */
	lerp: function(a,b,f) {
	    return a+f*(b-a);
	},

	/**
	 * Rotate a Pixi point around an origin
	 * @param point to rotate
	 * @param origin pixi point to rotate around
	 * @param rotation rotation in radians
	 */
	rotatePoint: function(point, origin, rotation) {
		var dx = point.x - origin.x;
		var dy = point.y - origin.y;
		var len = Math.sqrt(dx*dx + dy*dy);
		var dir = Math.atan2(dy, dx) + rotation;
		return new PIXI.Point(
			origin.x + Math.cos(dir)*len,
			origin.y + Math.sin(dir)*len
		);
	}
};