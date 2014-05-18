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
	 *   - delay: cooldown between generations
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

		generator._timer_ = generator.delay;

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
						"x": Graphics.width+Ufo.texture.width/2,
						"y": Random.next(Graphics.height)
					};
				break;
				case "linear":
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

	generators: {
		randomUfos: {
			"pattern": "random",
			"count": 1,
			"type": "Ufo",
			"delay": 60,
			"params": {}
		}
	}
};