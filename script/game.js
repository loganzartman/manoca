"use strict";

var Game = {
	VERSION: 19,
	player: null,
	entities: [],
	particles: [],
	score: 0,
	level: null,
	playing: false,

	init: function() {
		ResourceLoader.queueScripts();
		ResourceLoader.addCallback(Game.start);
		ResourceLoader.load();
	},

	start: function() {
		UIFactory.init();
		MainMenu.init();
		Graphics.init();
		Starfield.init();
		Input.init();
		Game.level = Level.none; //todo: modularize

		Graphics.frame();
	},

	restart: function() {
		Game.score = 0;
		Game.entities = [];
		Game.particles = [];

		Graphics.initStage();

		Game.player = new Player({
			"x": -128,
			"y": Graphics.height/2,
			"texture": Player.texture
		});
		Game.entities.push(Game.player);

		Starfield.addToContainer(Graphics.stage);
		Starfield.speed = 1;

		Game.setStage(Graphics.stage);

		Graphics.canvas.style.cursor = "none";

		Game.level = Level;
		Game.playing = true;
	},

	end: function() {
		alert("Todo: Add score screen.\nYou scored "+Game.score+"!");
		Game.level = Level.none;
		Game.playing = false;
		Starfield.speed = 0.1;

		Graphics.canvas.style.cursor = "default";

		MainMenu.init(); //todo: fix this (why do we need to reinit to fix interactivity?)
		Starfield.addToContainer(MainMenu.stage);
		Game.setStage(MainMenu.stage);
	},

	setStage: function(stage) {
		Graphics.activeStage.visible = false;
		Graphics.activeStage = stage;
		stage.visible = true;
	},

	step: function() {
		if (Game.playing) {
			Game.level.step();

			for (var i = Game.entities.length - 1; i >= 0; i--) {
				var e = Game.entities[i];
				if (typeof e === "object") {
					e.step();
				}
			}

			for (var i = Game.particles.length - 1; i >= 0; i--) {
				var p = Game.particles[i];
				if (typeof p === "object") {
					p.step();
				}
			}

			//starfield 3d-ness
			var xo = Game.player.x - Graphics.width/2,
				yo = Game.player.y - Graphics.height/2;
			Starfield.offset = {
				"x": -xo*0.5,
				"y": -yo*0.5
			};
		}
	},

	addScore: function(points) {
		Graphics.scoreScale *= 1.5;
		Game.score += points;
	},

	settings: function() {
		console.log("Settings fired");
		if (Input.movementMode === Input.modes.KEYBOARD) {
			MainMenu.settingsButton.setText("input: mouse");
			Input.movementMode = Input.modes.MOUSE;
			return;
		}
		if (Input.movementMode === Input.modes.MOUSE) {
			MainMenu.settingsButton.setText("input: keyboard");
			Input.movementMode = Input.modes.KEYBOARD;
			return;
		}
	}
};

var ResourceLoader = {
	queueScripts: function() {
		ResourceLoader.queue("http://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");
		ResourceLoader.queue("webfont/PT Sans");
		ResourceLoader.queue("script/pixi.dev.js");
		ResourceLoader.queue("script/klass.js");
		ResourceLoader.queue("script/util.js");
		ResourceLoader.queue("script/graphics.js");
		ResourceLoader.queue("script/input.js");
		ResourceLoader.queue("script/starfield.js");
		ResourceLoader.queue("script/uifactory.js");
		ResourceLoader.queue("script/mainmenu.js");
		ResourceLoader.queue("script/entity.js");
		ResourceLoader.queue("script/particle.js");
		ResourceLoader.queue("script/smoke.js");
		ResourceLoader.queue("script/trailSmoke.js");
		ResourceLoader.queue("script/explosion.js");
		ResourceLoader.queue("script/player.js");
		ResourceLoader.queue("script/bullet.js");
		ResourceLoader.queue("script/basiclaser.js");
		ResourceLoader.queue("script/gunmounts.js");
		ResourceLoader.queue("script/hostile.js");
		ResourceLoader.queue("script/ufo.js");
		ResourceLoader.queue("script/worm.js");
		ResourceLoader.queue("script/cruiser.js");
		ResourceLoader.queue("script/hostileFactory.js");
		ResourceLoader.queue("script/level.js");
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
		var ext = source.substring(source.lastIndexOf(".")+1);
		
		function loadfunc() {
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

		if (ext == "js") {
			var script = document.createElement("script");
			script.onload = loadfunc;
			script.src = source;
			document.head.appendChild(script);
		}
		else if (ext.indexOf("webfont/") === 0) {
			var name = ext.substring(ext.indexOf("/")+1);
			WebFont.load({
				google: {
					families: [name]
				}
			});
			loadfunc();
		}
	}
};