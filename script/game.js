"use strict";

var Game = {
	VERSION: "0.1.42",
	player: null,
	entities: [],
	particles: null,
	particleSystem: null,
	score: 0,
	highScore: 0,
	level: null,
	playing: false,
	time: 0,
	debugMode: false,
	frameTimer: null,
	dataStorage: localStorage||{}, //player doesn't deserve saved state if their browser doesn't support web storage

	init: function() {
		console.log("%c %c MANOCA v"+Game.VERSION+" %c ",
			"background: black",
			"background: #222222; color: orange",
			"background: black"
		);

		setTimeout(function(){
			Game.removeSplash = function(){
				var el = document.getElementById("splash");
				if (el) document.body.removeChild(el);
			}
			if (Game.level!==null) {
				Game.removeSplash();
			}
		},3000);
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
		if(typeof Game.dataStorage.highScore === "undefined") Game.dataStorage.highScore = 0;
		Game.frameTimer = setInterval(Graphics.frame, 16);
		Game.removeSplash();
		console.log("%c %c All systems go! %c ",
			"background: #777777",
			"background: #BBBBBB; color: green",
			"background: #777777"
		);
	},

	restart: function() {
		if(Game.score >= Game.dataStorage.highScore) Game.dataStorage.highScore = Game.score;
		Game.score = 0;
		Game.entities = [];
		Game.particles = null;

		Graphics.initStage();
		Game.particleSystem = new ParticleSystem({"container": Graphics.particles});

		Game.player = new Player(Util.collect({
			"x": -128,
			"y": Graphics.height/2,
		},Player.ships[MainMenu.shipIndex]));
		Game.entities.push(Game.player);

		Starfield.addToContainer(Graphics.stage);
		Starfield.speed = 1;

		Game.setStage(Graphics.stage);

		document.body.style.cursor = "none";

		Game.level = Level;
		Game.playing = true;
	},

	end: function() {
		Game.level = Level.none;
		Game.playing = false;
		Starfield.speed = 0.1;

		ScoreScreen.init(); //todo: fix this (why do we need to reinit to fix interactivity?)
		Starfield.addToContainer(ScoreScreen.stage);
		Game.setStage(ScoreScreen.stage);
	},

	mainMenu: function() {
		MainMenu.init();
		Starfield.addToContainer(MainMenu.stage);
		Game.setStage(MainMenu.stage);
	},

	setStage: function(stage) {
		Graphics.activeStage.visible = false;
		Graphics.activeStage = stage;
		Graphics.addCursor();
		Graphics.addOverlay();
		stage.visible = true;
	},

	step: function() {
		if (Game.playing) {
			Game.time++;
			Game.level.step();

			for (var i = Game.entities.length - 1; i >= 0; i--) {
				var e = Game.entities[i];
				if (typeof e === "object") {
					e.step();
				}
			}

			Game.particleSystem.step();

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
	},

	removeSplash: function() {
		//this space intentionally left blank
	}
};

var ResourceLoader = {
	queueScripts: function() {
		//Fonts
		ResourceLoader.queue("http://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");
		ResourceLoader.queue("webfont/PT Sans");
		ResourceLoader.queue("webfont/Play");
		ResourceLoader.queue("webfont/Titillium Web");

		//Core
		ResourceLoader.queue("script/pixi.dev.js");
		ResourceLoader.queue("script/pixiMods.js");
		ResourceLoader.queue("script/klass.js");
		ResourceLoader.queue("script/util.js");
		ResourceLoader.queue("script/graphics.js");
		ResourceLoader.queue("script/input.js");
		ResourceLoader.queue("script/starfield.js");
		ResourceLoader.queue("script/uifactory.js");
		ResourceLoader.queue("script/mainmenu.js");
		ResourceLoader.queue("script/scorescreen.js");
		ResourceLoader.queue("script/entity.js");

		//Particles
		ResourceLoader.queue("script/particle/particle.js");
		ResourceLoader.queue("script/particle/particleSystem.js");
		ResourceLoader.queue("script/particle/smoke.js");
		ResourceLoader.queue("script/particle/trailSmoke.js");
		ResourceLoader.queue("script/particle/engineFlare.js");
		ResourceLoader.queue("script/particle/explosion.js");
		
		//Weapons
		ResourceLoader.queue("script/weapon/bullet.js");
		ResourceLoader.queue("script/weapon/basiclaser.js");
		ResourceLoader.queue("script/weapon/deimoslaser.js");
		ResourceLoader.queue("script/weapon/boralaser.js");
		ResourceLoader.queue("script/weapon/cruiserlaser.js");
		ResourceLoader.queue("script/weapon/gunmounts.js");

		//Ships
		ResourceLoader.queue("script/ship/player.js");
		ResourceLoader.queue("script/ship/hostile.js");
		ResourceLoader.queue("script/ship/ufo.js");
		ResourceLoader.queue("script/ship/worm.js");
		ResourceLoader.queue("script/ship/cruiser.js");

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
