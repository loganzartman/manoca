"use strict";

var Game = {
	VERSION: "0.1.42",
	loaded: false,
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

	/**
	 * Called on page load.
	 * Scripts are NOT loaded at this point.
	 */
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
			if (Game.loaded) {
				Game.removeSplash();
			}
		},3000);
		ResourceLoader.queueScripts();
		ResourceLoader.addCallback(Game.start);
		ResourceLoader.load();
	},

	/**
	 * Called once all scripts are loaded.
	 * Calls initialization methods. (order is often important!)
	 */
	start: function() {
		Game.loaded = true;
		UIFactory.init();
		Level.init();
		MainMenu.init();
		Graphics.init();
		Starfield.init();
		Input.init();

		if(typeof Game.dataStorage.highScore === "undefined") Game.dataStorage.highScore = 0;
		
		Game.frameTimer = setInterval(Graphics.frame, 16);
		Game.removeSplash();
		
		console.log("%c %c All systems go! %c ",
			"background: #777777",
			"background: #BBBBBB; color: green",
			"background: #777777"
		);
	},

	/**
	 * Starts gameplay once it has been stopped (eg. a menu stage is active).
	 * @param level {Object} the level that should be loaded.  See Level class.
	 */
	restart: function(level) {
		if(Game.score >= Game.dataStorage.highScore) Game.dataStorage.highScore = Game.score;
		Game.score = 0;
		Game.entities = [];
		Game.particles = null;

		Level.setLevel(level);
		Graphics.initStage();
		Game.particleSystem = new ParticleSystem({"container": Graphics.particles});

		Game.player = new Player(Util.collect({
			"x": -128,
			"y": Graphics.height/2,
		},Player.ships[MainMenu.shipIndex]));
		Game.entities.push(Game.player);

		Starfield.addToContainer(Graphics.stage, Level.background);
		Starfield.speed = 1;

		Game.setStage(Graphics.stage);

		document.body.style.cursor = "none";
		Game.playing = true;
	},

	/**
	 * Stops the game immediately and returns to the score screen.
	 */
	end: function() {
		Level.setLevel(Levels[0]);
		Game.playing = false;
		Starfield.speed = 0.1;

		ScoreScreen.init(); //todo: fix this (why do we need to reinit to fix interactivity?)
		Starfield.addToContainer(ScoreScreen.stage);
		Game.setStage(ScoreScreen.stage);
	},

	/**
	 * Switches to the Main Menu.
	 */
	mainMenu: function() {
		MainMenu.init();
		Starfield.addToContainer(MainMenu.stage);
		Game.setStage(MainMenu.stage);
	},

	/**
	 * Sets the active stage.  This could be the main menu stage, the score screen stage, etc.
	 * @param stage {PIXI.Stage} the stage to switch to
	 */
	setStage: function(stage) {
		Graphics.activeStage.visible = false;
		Graphics.activeStage = stage;
		Graphics.addCursor();
		Graphics.addOverlay();
		stage.visible = true;
	},

	/**
	 * Performs a single game step.  This is called by an interval.
	 */
	step: function() {
		if (Game.playing) {
			Game.time++;
			Level.step();

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

	/**
	 * Adds points to the player's score.
	 * @param points {Number} number of score points to add
	 */
	addScore: function(points) {
		Graphics.scoreScale *= 1.5;
		Game.score += points;
	},

	/**
	 * Shows the settings screen.
	 * NOTE: Currently toggles between input modes; there is no settings screen.
	 */
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

	/**
	 * Hide the loading splash.
	 * You probably shouldn't be calling this.
	 */
	removeSplash: function() {
		//this space intentionally left blank
	}
};

var ResourceLoader = {
	/**
	 * Any scripts that need to be loaded at game start are queued here.
	 * Called by Game.init.
	 */
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

	/**
	 * Queue a resource.
	 * The resource loader currently handles only JavaScript files and webfonts.
	 * To load a font, queue "webfont/Name", where Name is the name of a font available via Google Fonts.
	 * @param source {String} the path to the file to queue
	 */
	queue: function(source) {
		ResourceLoader.resourceQueue.push(source);
	},

	/**
	 * Adds a callback to be called once loading completes.
	 * @param f {Function} the callback function
	 */
	addCallback: function(f) {
		ResourceLoader.completedCallbacks.push(f);
	},

	/**
	 * Asynchronously loads all queued resources and then performs callbacks.
	 */
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
