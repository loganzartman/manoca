"use strict";

var Hostile = Entity.extend(function(props){

})
.methods({
	step: function() {
		this.supr();
		if (!this.inBounds({"x1": 0})) {
			this.destroy();
		}
	},

	kill: function() {
		this.destroy();
	}
});