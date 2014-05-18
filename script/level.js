"use strict";

//todo: modularize
var Level = {
	step: function() {
		Level.generateHostiles();
	},

	currentGenerator: HostileFactory.generators.randomUfos,
	generateHostiles: function() {
		HostileFactory.make(Level.currentGenerator);
	},
};