"use strict";

var HostileFactory = {
	makeUfo: function(params) {
		var r = new Random();
		var ufo = new Ufo({
			"x": either(params.x, Graphics.width+Ufo.texture.width/2),
			"y": either(params.y, r.next(Graphics.height)),
			"xs": either(params.xs, r.next(-2,-6)),
			"ys": either(params.ys, r.next(-1,1)),
			"texture": Ufo.texture
		});
		Game.entities.push(ufo);
	},

	makeWorm: function(params) {
		var worm = new Worm({
			"x": either(params.x, Graphics.width+Ufo.texture.width/2),
			"y": either(params.y, Random.next(Graphics.height)),
			"xs": either(params.xs, -3),
			"ys": either(params.ys, 0),
			"texture": Worm.texture
		});
		Game.entities.push(worm);
	},

	/**
	 * Creates hostiles automagically.
	 * generator should contain the following:
	 *   - pattern: in which pattern hostiles should be positioned.
	 *       may be any of the following:
	 *         - "point": a single point. Define with generator.point {x,y} and generator.vel {x,y}
	 *         - "random": random positions at the edge of the screen
	 *         - "linear": a linear arrangement (TODO)
	 *         - "delta": a triangular arrangement (TODO)
	 *   - count: the number of hostiles to generate
	 *   - type: a string representing the hostile type (eg. "Ufo")
	 *   - delay: delay before start of generation
	 *   - cooldown: delay between generations
	 *   - params: any other parameters to pass to the entity constructors
	 * @param generator a map of parameters
	 */
	make: function(generator) {
		if (typeof generator._timer_ === "undefined") {
			generator._timer_ = generator.delay;
		}
		else if (generator._timer_>0) {
			generator._timer_--;
			return;
		}

		generator._timer_ = generator.cooldown;

		function getCoords(i) {
			switch (either(generator.pattern, "random")) {
				case "point":
					return {
						"x": generator.point.x,
						"y": generator.point.y,
						"xs": generator.vel.x,
						"ys": generator.vel.y
					};
				break;
				case "random":
					return {
						"x": Graphics.width+window[generator.type].texture.width/2,
						"y": Random.next(Graphics.height)
					};
				break;
				case "linear":
					var offsetX = (generator.point1.x-generator.point2.x)-(~~((generator.point1.x-generator.point2.x)/4))*4;
			    	var offsetY = (generator.point1.y-generator.point2.y)-(~~((generator.point1.y-generator.point2.y)/4))*4;
				    return {
			            "x": Util.lerp(generator.point1.x, generator.point2.x, i/generator.count)+offsetX/2,
			            "y": Util.lerp(generator.point1.y, generator.point2.y, i/generator.count)+offsetY/2,
			            "xs": generator.xs,
			            "ys": generator.ys
				    };
				break;
				case "delta":
				break;
			}
			throw new Error("generator does not contain a valid pattern.");
		}

		generator.params = either(generator.params, {});

		for (var i = generator.count - 1; i >= 0; i--) {
			//auto-generate coords
			var coords = getCoords(i);
			var params = {
				"x": coords.x,
				"y": coords.y,
				"xs": coords.xs,
				"ys": coords.ys,
				"texture": window[generator.type].texture
			};

			//copy in extra properties
			for (var p in generator.params) {
				if (generator.params.hasOwnProperty(p)) {
					params[p] = generator.params[p];
				}
			}
			
			//construct and add
			var ent = new window[generator.type](params);
			Game.entities.push(ent);
		}
	},
	
	/**
	 * Get the generator name from the generators object.
	 * Also allows you to add your own properties, as defined in params.
	 * @name name of the generator
	 * @params params to overwrite
	 */
	getGenerator: function(name, params) {
	    var gen = {};
	    for (var prop in HostileFactory.generators[name]) {
	        if (HostileFactory.generators[name].hasOwnProperty(prop)) {
	            gen[prop] = HostileFactory.generators[name][prop];
	        }
	    }
	    for (var repl in params) {
	        if (params.hasOwnProperty(repl)) {
	            gen[repl] = params[repl];
	        }
	    }
	    return gen;
	},

	generators: {
		ufoRandom: {
			"pattern": "random",
			"count": 1,
			"type": "Ufo",
			"cooldown": 60,
			"delay": 120,
			"params": {}
		},

		wormRandom: {
			"pattern": "random",
			"count": 1,
			"type": "Worm",
			"cooldown": 200,
			"delay": 400,
			"params": {}
		},
		
		ufoLine: {
			"pattern": "linear",
			"point1": {
			    "x": Graphics.width+64,
			    "y": 64
			},
			"point2": {
			    "x": Graphics.width+64,
			    "y": Graphics.height+64
			},
			"xs": -3,
			"ys": 0,
			"count": 4,
			"type": "Ufo",
			"cooldown": 500,
			"delay": 500,
			"params": {}
		},

		cruiserRandom: {
			"pattern": "random",
			"count": 1,
			"type": "Cruiser",
			"cooldown": 500,
			"delay": 800,
			"params": {}
		}
	}
};