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

var Util = {
	formatNumberCommas: function(n) {
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},

	/**
	* Concatenates the properties of all arguments into a single object.
	* @param arguments two or more objects to concatenate.
	* @return new object with concatenated properties
	*/
	collect: function() {
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
	},

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

	tween: function(percentage, midpoint, start, mid, end) {
		if (percentage<midpoint) {
			//return Util.easeOutCubic(percentage/midpoint,start,mid-start,1);
			return Util.lerp(start, mid, percentage/midpoint);
		}
		else if (percentage>=midpoint) {
			//return Util.easeInCubic((percentage-midpoint)/(1-midpoint),mid,end-mid,1);
			return Util.lerp(mid, end, (percentage-midpoint)/(1-midpoint));
		}
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
	},

	hsl2rgb: function(h, s, l) {
	    function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

	    var r, g, b;

	    if(s == 0){
	        r = g = b = l; // achromatic
	    }else{
	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3);
	    }

	    return (Math.round(r * 255)<<16) + (Math.round(g * 255)<<8) + (Math.round(b * 255));
	},

	List: function() {
		var l = {};
		l.length = 0;
		l.push = function(item) {
			l[l.length++] = item;
		};
		l.indexOf = function(item) {
			for (var i in l) {
				if (l[i] === item) {
					return i;
				}
			}
			return -1;
		};
		l.remove = function(index) {
			delete l[index];
		};
		return l;
	},

	logcolor: function(col) {
		if (!(col instanceof Array)) col = PIXI.hex2rgb(col);
		console.log("%c  ", "background: rgb("+(~~(col[0]*255))+","+(~~(col[1]*255))+","+(~~(col[2]*255))+"); font-size: 30px;");
	},

	isTouchDevice: function() {
		return navigator.maxTouchPoints || navigator.msMaxTouchPoints;
	},

	toggleFullscreen: function() {
		var doc = window.document;
		var docEl = doc.documentElement;

		var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
		var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

		if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			requestFullScreen.call(docEl);
		}
		else {
			cancelFullScreen.call(doc);
		}
	},

	checkFullscreen: function() {
		var doc = window.document;
		return doc.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement;
	}
};