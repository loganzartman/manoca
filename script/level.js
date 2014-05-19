"use strict";

//todo: modularize
var Level = {
	step: function() {
		Level.generateHostiles();
	},

	currentGenerators: [HostileFactory.generators.ufoRandom,
	                    HostileFactory.generators.ufoLine],
	generateHostiles: function() {
	    for (var i=0; i<Level.currentGenerators.length; i++) {
	        HostileFactory.make(Level.currentGenerators[i]);
	    }
	},
};