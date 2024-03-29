"use strict";

var Levels = [];
var Level = {
	none: null, //set to an empty level on init
	completed: false,
	hostileCount: 0,

	init: function() {
		Levels = [
			{
				"name": "",
				"background": -1,
				"generators": []
			},
			{
				"name": "Test",
				"background": -1,
				"generators": []
			},
			{
				"name": "Intro",
				"background": 0,
				"generators": [
					HostileFactory.getGenerator("ufoRandom",{})
				]
			},
			{
				"name": "Deep Space",
				"background": 4,
				"generators": [
					HostileFactory.getGenerator("ufoRandom",{"cooldown": 100}),
					HostileFactory.getGenerator("wormLine",{"count": 3})
				]
			},
			{
				"name": "Armageddon",
				"background": 6,
				"generators": [
					HostileFactory.getGenerator("ufoRandom",{}),
	            	HostileFactory.getGenerator("ufoLine",{}),
	            	HostileFactory.getGenerator("wormRandom",{}),
	            	HostileFactory.getGenerator("cruiserRandom",{})
	            ]
			},
			{
				"name": "test2",
				"background": 5,
				"generators": [
					HostileFactory.getGenerator("ufoCrazy",{})
	            ]
			}
		];

		Level.setLevel(Levels[0]); //set to "none" level
	},

	/**
	 * Sets the currently active level.
	 * The level parameter should be an object with these properties:
	 * name: the name of the level
	 * background: a background index or -1 for a random background
	 * generators: an array of HostileFactory generators
	 *
	 * @param level {Object} the level to activate
	 */
	setLevel: function(level) {
		Level.currentGenerators = level.generators;
		Level.name = level.name;
		Level.hostileCount = 0;

		var ind = level.background<0?~~Random.next(7):level.background;
		Level.background = PIXI.Texture.fromImage("img/nebula"+ind+".png");
	},

	step: function() {
		//completion check
		if (!Level.completed) {
			//for debugging purposes
			if (Level.name==="Test") Level._completeLevel();
			
			//standard level completion check
			else if (Level.hostileCount === 0) {
				var completed = true;
				for (var i = Level.currentGenerators.length - 1; i >= 0; i--) {
					completed = completed&&Level.currentGenerators[i].isComplete();
				};
				if (completed) Level._completeLevel();
			}
		}
		Level.generateHostiles();
	},

	_completeLevel: function() {
		Level.completed = true;
		UIFactory.showStatus({"text": "Level Complete.  Press H/Tap to activate hyperdrive."});
	},

	currentGenerators: [],

	generateHostiles: function() {
	    for (var i=0; i<Level.currentGenerators.length; i++) {
	        HostileFactory.make(Level.currentGenerators[i]);
	    }
	},
};