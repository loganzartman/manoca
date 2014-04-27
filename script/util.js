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

function Random(seed) {
	this.seed = seed || Date.now();
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
	xmod: function(a,b) {return ((a%b)+b)%b;}
};