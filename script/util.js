"use strict";
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

function either(things) {
	for (var i=0; i<arguments.length; i++) {
		if (typeof arguments[i] !== "undefined") {
			return arguments[i];
		}
	}
	return undefined;
}

function Random(seed) {
	this.seed = seed || ~~(Math.random()*10e8);
}
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

function sign(x) {
    return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

var Util = {
	//time, beginning value, change in value, duration
	easeInCubic: function (t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (t, b, c, d) {
		if ((t/=d/2) < 1) {
			return c/2*t*t*t + b;
		}
		else {
			return c/2*((t-=2)*t*t + 2) + b;
		}
	},
	xmod: function(a,b) {return ((a%b)+b)%b;},
	lerp: function(a,b,f) {
	    return a+f*(b-a);
	}
};