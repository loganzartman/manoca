"use strict";

var Game = {
	player: null,
	entities: [],

	init: function() {
		ResourceLoader.queueScripts();
		ResourceLoader.addCallback(Game.start);
		ResourceLoader.load();
	},

	start: function() {
		Graphics.init();
		Starfield.init();
		Input.init();

		Game.player = new Player({
			"x": -128,
			"y": Graphics.height/2,
			"texture": Player.texture
		});
		Game.entities.push(Game.player);

		setInterval(function(){
			var r = new Random();
			var ufo = new Ufo({
				"x": Graphics.width+Ufo.texture.width/2,
				"y": r.next(Graphics.height),
				"xs": r.next(-2,-6),
				"ys": r.next(-1,1),
				"texture": Ufo.texture
			});
			Game.entities.push(ufo);
		},1000);

		Graphics.frame();
	},

	step: function() {
		for (var i = Game.entities.length - 1; i >= 0; i--) {
			var e = Game.entities[i];
			if (typeof e === "object") {
				e.step();
			}
		};
	}
};

var ResourceLoader = {
	queueScripts: function() {
		ResourceLoader.queue("script/pixi.dev.js");
		ResourceLoader.queue("script/klass.js");
		ResourceLoader.queue("script/util.js");
		ResourceLoader.queue("script/input.js");
		ResourceLoader.queue("script/graphics.js");
		ResourceLoader.queue("script/starfield.js");
		ResourceLoader.queue("script/entity.js");
		ResourceLoader.queue("script/player.js");
		ResourceLoader.queue("script/bullet.js");
		ResourceLoader.queue("script/basiclaser.js");
		ResourceLoader.queue("script/gunmounts.js");
		ResourceLoader.queue("script/hostile.js");
		ResourceLoader.queue("script/ufo.js");
	},

	resourceQueue: [],
	completedCallbacks: [],

	queue: function(source) {
		ResourceLoader.resourceQueue.push(source);
	},

	addCallback: function(f) {
		ResourceLoader.completedCallbacks.push(f);
	},

	load: function() {
		var source = ResourceLoader.resourceQueue.shift();
		var script = document.createElement("script");
		script.onload = function() {
			if (ResourceLoader.resourceQueue.length>0) {
				ResourceLoader.load();
			}
			else {
				while (ResourceLoader.completedCallbacks.length>0) {
					var callback = ResourceLoader.completedCallbacks.shift();
					callback();
				}
			}
		};
		script.src = source;
		document.head.appendChild(script);
	}
};