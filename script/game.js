"use strict";

var Game = {
	VERSION: "0.1.53",
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
	profile: null,

	/**
	 * Called on page load.
	 * Scripts are NOT loaded at this point.
	 */
	init: function() {
		console.log("%c %c MANOCA v"+Game.VERSION+" %c ",
			"font-size: 24px; background: black",
			"font-size: 24px; background: #222222; color: orange",
			"font-size: 24px; background: black"
		);

		setTimeout(function(){
			Game.removeSplash = function(){
				var el = document.getElementById("splash");
				if (el) document.body.removeChild(el);
			}
			if (Game.loaded) {
				Game.removeSplash();
			}
		},window.location.href.indexOf("file")===0?0:3000);

		document.body.style.cursor = "none";

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

		var profileLoaded = false;
		for (var prop in Game.dataStorage) {
			if (prop.indexOf("profile_") === 0) {
				Game.profile = Profile.load(prop.substring(8));
				profileLoaded = true;
				break;
			}
		}
		if (!profileLoaded) {
			if (Game.dataStorage.scrap) {alert("Welcome back!  Your collected scrap has been reset, as the scrap system has been rebalanced.  However, your highscore has been imported.");}
			Game.profile = Profile.create({
				"name": "Pilot", //todo: allow customization
				"highscore": either(Game.dataStorage.highScore, 0)
			}); 
		}

		UIFactory.init();
		Level.init();
		MainMenu.init(); //TEST: REMOVAL
		Graphics.init();
		Sound.init();
		Starfield.init();
		Input.init();
		
		Game.frameTimer = setInterval(Graphics.frame, 16);
		Game.removeSplash();
		
		console.log("%c %c All systems go! %c ",
			"background: #777777",
			"background: #BBBBBB; color: green",
			"background: #777777"
		);

		Game.mainMenu();
	},

	starmap: function() {
		Starmap.init();
		Starfield.addToContainer(Starmap.stage);
		Game.setStage(Starmap.stage);
	},

	/**
	 * Opens the ship selection menu after a level has been selected.
	 * @param level {Object} the level that should be loaded.  See Level class.
	 */
	shipSelect: function(level) {
		ShipSelect.init(level);
		Starfield.addToContainer(ShipSelect.stage);
		Game.setStage(ShipSelect.stage);
	},

	/**
	 * Starts gameplay once it has been stopped (eg. a menu stage is active).
	 * @param level {Object} the level that should be loaded.  See Level class.
	 */
	restart: function(level) {
		Game.score = 0;
		Game.time = 0;
		Game.entities = [];
		Game.particles = null;

		Level.setLevel(level);
		Graphics.initStage();
		Game.particleSystem = new ParticleSystem({"container": Graphics.particles});

		Game.player = new Player(Util.collect({
			"x": -128,
			"y": Graphics.height/2,
		},ShipSelect.selected));
		Game.entities.push(Game.player);

		Starfield.addToContainer(Graphics.stage, Level.background);
		Starfield.speed = Starfield.gameSpeed;

		CarrierIntro.init(Graphics.stage);

		Game.setStage(Graphics.stage);

		document.body.style.cursor = "none";
		Game.playing = true;
	},

	/**
	 * Stops the game immediately and returns to the score screen.
	 */
	end: function() {
		//Write score and scrap to profile
		if(Game.score >= Game.profile.highscore) {
			Game.profile.highscore = Game.score;
		}
		Game.profile.scrap += Game.player.scrap;
		Profile.save(Game.profile);

		//"Unload" the level
		CarrierIntro.destroy();
		Level.setLevel(Levels[0]);
		Game.playing = false;
		Starfield.resetWarp();
		Starfield.speed = Starfield.menuSpeed;

		//Launch score screen
		ScoreScreen.init();
		Level.completed = false;
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
		Game.time++;
		if (Game.playing) {
			Level.step();

			CarrierIntro.step();

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
	 */
	settings: function() {
		SettingsScreen.init();
		Starfield.addToContainer(SettingsScreen.stage);
		Game.setStage(SettingsScreen.stage);
	},

	/**
	 * Shows the about screen.
	 */
	about: function() {
		AboutScreen.init();
		Starfield.addToContainer(AboutScreen.stage);
		Game.setStage(AboutScreen.stage);
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
		ResourceLoader.queue("webfont/Exo");

		//Core
		ResourceLoader.queue("script/pixi.dev.js");
		ResourceLoader.queue("script/pixiMods.js");
		ResourceLoader.queue("script/klass.js");
		ResourceLoader.queue("script/util.js");
		ResourceLoader.queue("script/graphics.js");
		ResourceLoader.queue("script/input.js");
		ResourceLoader.queue("script/starfield.js");
		ResourceLoader.queue("script/uifactory.js");
		ResourceLoader.queue("script/entity.js");

		//Sound
		ResourceLoader.queue("script/howler.js");
		ResourceLoader.queue("script/sound.js");

		//Etc
		ResourceLoader.queue("script/profile.js");
		ResourceLoader.queue("script/scrap.js");
		ResourceLoader.queue("script/carrierIntro.js");

		//Particles
		ResourceLoader.queue("script/particle/particle.js");
		ResourceLoader.queue("script/particle/particleSystem.js");
		ResourceLoader.queue("script/particle/smoke.js");
		ResourceLoader.queue("script/particle/trailSmoke.js");
		ResourceLoader.queue("script/particle/engineFlare.js");
		ResourceLoader.queue("script/particle/explosion.js");
		ResourceLoader.queue("script/particle/testParticle.js");
		ResourceLoader.queue("script/particle/shockwave.js");
		
		//Weapons
		ResourceLoader.queue("script/weapon/bullet.js");
		ResourceLoader.queue("script/weapon/basicplasma.js");
		ResourceLoader.queue("script/weapon/deimosplasma.js");
		ResourceLoader.queue("script/weapon/boraplasma.js");
		ResourceLoader.queue("script/weapon/cruiserplasma.js");
		ResourceLoader.queue("script/weapon/basiccannon.js");
		ResourceLoader.queue("script/weapon/basiclaser.js");
		ResourceLoader.queue("script/weapon/gunmounts.js");

		//Ships
		ResourceLoader.queue("script/ship/player.js");
		ResourceLoader.queue("script/ship/hostile.js");
		ResourceLoader.queue("script/ship/dummyship.js");
		ResourceLoader.queue("script/ship/ufo.js");
		ResourceLoader.queue("script/ship/scout.js");
		ResourceLoader.queue("script/ship/worm.js");
		ResourceLoader.queue("script/ship/cruiser.js");
		
		//Levels
		ResourceLoader.queue("script/hostileFactory.js");
		ResourceLoader.queue("script/level.js");

		//Stages (ie. menus)
		ResourceLoader.queue("script/stage/mainmenu.js");
		ResourceLoader.queue("script/stage/scorescreen.js");
		ResourceLoader.queue("script/stage/settingsscreen.js");
		ResourceLoader.queue("script/stage/aboutscreen.js");
		ResourceLoader.queue("script/stage/starmap.js");
		ResourceLoader.queue("script/stage/shipselect.js");
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
