"use strict";

//todo: modularize
var Level = {
	step: function() {
		Level.generateHostiles();
	},

	currentGenerators: [HostileFactory.getGenerator("ufoRandom",{}),
	                    HostileFactory.getGenerator("ufoLine",{}),
	                    HostileFactory.getGenerator("wormRandom",{})],
	generateHostiles: function() {
	    for (var i=0; i<Level.currentGenerators.length; i++) {
	        HostileFactory.make(Level.currentGenerators[i]);
	    }
	},

	none: {
		step: function() {
			
		}
	}
};