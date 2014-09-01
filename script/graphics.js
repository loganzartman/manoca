"use strict";
var Graphics = {
	//The HTML5 Canvas element used for output
	canvas: null,

	//The Pixi Stage which contains game objects
	stage: null,
	activeStage: null,

	//Spritebatch used to render particles
	particles: null,
	displacementFilter: null,

	//The Pixi Renderer used to draw the stage
	renderer: null,

	//For dynamic bloom
	bloomTexture: null,
	bloomSprite: null,

	//Dimensions used for rendering
	width: 1200,
	height: 700,

	//Scale of score text
	scoreScale: 1,

	debugWatch: [],

	//Pixi Textures stored for re-use
	texture: {
		"engineFire": PIXI.Texture.fromImage("img/fire10.png"),
		"engineFireLight": PIXI.Texture.fromImage("img/fire10light.png"),
		"displacement1": PIXI.Texture.fromImage("img/disp1.png"),
		"hyperspace": PIXI.Texture.fromImage("img/hyperspace.png"),
		"cursor": PIXI.Texture.fromImage("img/cur.png"),
		"mouseforce": PIXI.Texture.fromImage("img/mouseforce.png"),
		"overlay": PIXI.Texture.fromImage("img/overlay2.png"),
		"none": PIXI.Texture.fromImage("img/none.png")
	},

	/**
	 * Initialize Pixi and canvases.
	 * This method sizes and positions the canvas.
	 */
	init: function() {
		

		Graphics.activeStage = MainMenu.stage; //because
		Game.setStage(MainMenu.stage);

		var rand = new Random();
		Graphics.canvas = document.getElementById("display");
		Graphics.canvas.width = Graphics.width;
		Graphics.canvas.height = Graphics.height;
		Graphics.canvas.style.marginLeft = ~~(-Graphics.width/2) + "px";
		Graphics.canvas.style.marginTop = ~~(-Graphics.height/2) + "px";
		Graphics.canvas.style.left = Graphics.canvas.style.top = "50%";

		Graphics.initStage();

		Graphics.renderer = PIXI.autoDetectRenderer(
			Graphics.width,
			Graphics.height,
			Graphics.canvas,
			false,
			true
		);

		window.addEventListener("resize", Graphics.resize, false);
	},

	addCursor: function() {
		Graphics.cursor = new PIXI.Sprite(Graphics.texture.cursor);
		Graphics.cursor.anchor = new PIXI.Point(0.5,0.5);
		Graphics.cursor.blendMode = PIXI.blendModes.NORMAL;
		Graphics.cursor.depth = 100000;
		Graphics.activeStage.addChild(Graphics.cursor);
	},

	addOverlay: function() {
		Graphics.overlay = new PIXI.Sprite(Graphics.texture.overlay);
		Graphics.overlay.position = new PIXI.Point(0,0);
		Graphics.overlay.scale = new PIXI.Point(Graphics.width/Graphics.texture.overlay.width, Graphics.height/Graphics.texture.overlay.height);
		Graphics.overlay.alpha = 0.5;
		Graphics.overlay.depth = 10000;
		Graphics.activeStage.addChild(Graphics.overlay);
	},

	initStage: function(backTexture) {
		Graphics.stage = new PIXI.Stage(0x000000);


		//particle batch
		Graphics.particles = new PIXI.DisplayObjectContainer();
		Graphics.particles.depth = 1000;
		Graphics.particles.blendMode = PIXI.blendModes.NORMAL;
		Graphics.stage.addChild(Graphics.particles);

		//score thingy
		Graphics.score = new PIXI.Text("Score: -1", {
			font: "bold 20px 'Exo'",
			fill: "white",
			stroke: "black",
			strokeThickness: 2
		});
		Graphics.score.position = new PIXI.Point(32,16);
		Graphics.score.scale = new PIXI.Point(1,1);
		Graphics.score.depth = 20000;
		Graphics.stage.addChild(Graphics.score);

		//health thingy
		Graphics.hull = new PIXI.Text("Hull: -1", {
			font: "bold 20px 'Exo'",
			fill: "red",
			stroke: "black",
			strokeThickness: 2
		});
		Graphics.hull.position = new PIXI.Point(32,48);
		Graphics.hull.scale = new PIXI.Point(1,1);
		Graphics.hull.depth = 20000;
		Graphics.stage.addChild(Graphics.hull);

		//scrap thingy
		Graphics.scrap = new PIXI.Text("Scrap: -1", {
			font: "bold 20px 'Exo'",
			fill: "red",
			stroke: "black",
			strokeThickness: 2
		});
		Graphics.scrap.position = new PIXI.Point(32,80);
		Graphics.scrap.scale = new PIXI.Point(1,1);
		Graphics.scrap.depth = 20000;
		Graphics.stage.addChild(Graphics.scrap);

		//mouse force thing
		Graphics.mouseforce = new PIXI.Sprite(Graphics.texture.mouseforce);
		Graphics.mouseforce.anchor = new PIXI.Point(0.5,0.5);
		Graphics.mouseforce.blendMode = PIXI.blendModes.ADD;
		Graphics.mouseforce.depth = 100001;
		Graphics.stage.addChild(Graphics.mouseforce);

		//debug text
		Graphics.debugText = new PIXI.Text("DEBUG MODE", {
			font: "bold 12px monospace",
			stroke: "black",
			align: "left",
			strokeThickness: 2,
			fill: "white"
		});
		Graphics.debugText.position = new PIXI.Point(32,118);
		Graphics.debugText.scale = new PIXI.Point(1,1);
		Graphics.debugText.depth = 20000;
		Graphics.debugText.visible = false;
		Graphics.stage.addChild(Graphics.debugText);
	},

	/**
	 * Render a frame.
	 * This method should only be called once, in Game.init.
	 * Subsequent calls are made by requestAnimationFrame()
	 */
	frame: function() {
		Game.step();
		Starfield.frame();

		if (Graphics.activeStage !== Graphics.stage || Input.key(Input.VK_Q)) {
			Graphics.cursor.position = new PIXI.Point(
				Input.mouseX,
				Input.mouseY
			);
			Graphics.cursor.rotation += 0.05;
			Graphics.cursor.visible = true;
		}
		else {
			Graphics.cursor.visible = false;
		}

		if (Game.player && !Input.key(Input.VK_Q) && !Starfield.isWarping) {
			Graphics.mouseforce.visible = true;
			Graphics.mouseforce.position = new PIXI.Point(
					(Input.mouseX+Graphics.mouseforce.x)/2,
					(Input.mouseY+Graphics.mouseforce.y)/2
			);
			var mfdx = Input.mouseX-Game.player.x, mfdy = Input.mouseY-Game.player.y;
			Graphics.mouseforce.rotation = Math.atan2(mfdy, mfdx);
			var mfdist = Math.sqrt(mfdx*mfdx+mfdy*mfdy);
			Graphics.mouseforce.alpha = CarrierIntro.t<CarrierIntro.duration?0:Math.max(0,Math.min(1,(mfdist-40)/150));
			Graphics.mouseforce.tint = Game.player.flameColor;
		}
		else {
			Graphics.mouseforce.visible = false;
		}

		//update score
		Graphics.score.setText("Score: "+Util.formatNumberCommas(Game.score));
		Graphics.scoreScale = Math.max(1,Graphics.scoreScale/1.05);
		Graphics.score.scale = new PIXI.Point(Graphics.scoreScale,Graphics.scoreScale);
		if (Game.player) {
			Graphics.hull.setText("Hull: "+Game.player.health);
			var hv = ~~((Game.player.health/Game.player.maxHealth)*255);
			Graphics.hull.setStyle({
				font: "bold 20px 'Exo'",
				stroke: "black",
				align: "left",
				strokeThickness: 2,
				fill: "rgb("+(255-hv)+","+hv+",0)"
			});

			Graphics.scrap.setText("Scrap: "+Util.formatNumberCommas(Game.player.scrap));
			var sv = PIXI.hex2rgb(Util.hsl2rgb((Game.time*0.001)%1,1,0.7));
			Graphics.scrap.setStyle({
				font: "bold 20px 'Exo'",
				stroke: "black",
				align: "left",
				strokeThickness: 2,
				fill: "rgb("+(~~(sv[0]*255))+","+(~~(sv[1]*255))+","+(~~(sv[2]*255))+")"
			});
		}

		if (MainMenu.scraptext) {
			var sv = PIXI.hex2rgb(Util.hsl2rgb((Game.time*0.001)%1,1,0.7));
			MainMenu.scraptext.setStyle({
				font: "bold 30px 'Exo'",
				stroke: "black",
				align: "right",
				strokeThickness: 2,
				fill: "rgb("+(~~(sv[0]*255))+","+(~~(sv[1]*255))+","+(~~(sv[2]*255))+")"
			});
		}

		if (ScoreScreen.scrap) {
			var sv = PIXI.hex2rgb(Util.hsl2rgb((Game.time*0.001)%1,1,0.7));
			ScoreScreen.scrap.setStyle({
				font: "bold 90px 'Exo'",
				stroke: "black",
				align: "center",
				strokeThickness: 10,
				fill: "rgb("+(~~(sv[0]*255))+","+(~~(sv[1]*255))+","+(~~(sv[2]*255))+")"
			});
		}

		if (Game.debugMode && Game.playing) {
			var debstr = "DEBUG MODE\n"+
				"[invincible]\n"+
				"entities: "+Game.entities.length+"\n"+
				"particles: "+Game.particleSystem.count+"\n";
			for (var i = Graphics.debugWatch.length - 1; i >= 0; i--) {
				debstr += Graphics.debugWatch[i].prop + ": " + Graphics.debugWatch[i].obj[Graphics.debugWatch[i].prop] + "\n";
			};
			Graphics.debugText.setText(debstr);
		}

		//enable/disable debug text
		if (Game.debugMode ^ Graphics.debugText.visible) {
			Graphics.debugText.visible = !Graphics.debugText.visible;
		}

		//Graphics.bloomTexture.render(Graphics.stage);
		Graphics.renderer.render(Graphics.activeStage);

		//requestAnimationFrame(Graphics.frame); //was delivering sub-par fps with plenty of idle time
	},

	getBounds: function() {
		return {
			"x1": 0,
			"y1": 0,
			"x2": Graphics.width,
			"y2": Graphics.height
		};
	},

	addEngineFire: function(ship, textureName, offset, tint) {
		offset = either(offset, new PIXI.Point(0,0));

		ship.engineFire = {
			sprite: new PIXI.Sprite(Graphics.texture[textureName]),
			light: new PIXI.Sprite(Graphics.texture[textureName+"Light"]),
			scale: 1,
			updateSprite: function() {
				var rv = new Random().next(0.8,1.1);
				ship.engineFire.sprite.scale = new PIXI.Point(ship.engineFire.scale*rv,1);
				ship.engineFire.light.scale = new PIXI.Point(ship.engineFire.scale*rv,ship.engineFire.scale*rv);
			}
		};

		ship.engineFire.sprite.anchor = new PIXI.Point(1,0.5);
		ship.engineFire.sprite.position = new PIXI.Point(-ship.sprite.width/2 + offset.x, 0 + offset.y);
		ship.engineFire.sprite.blendMode = PIXI.blendModes.ADD;

		ship.engineFire.light.anchor = new PIXI.Point(0.8,0.5);
		ship.engineFire.light.position = new PIXI.Point(-ship.sprite.width/2 + offset.x, 0 + offset.y);
		ship.engineFire.light.alpha = 0.75;
		ship.engineFire.light.blendMode = PIXI.blendModes.ADD;

		if (typeof tint === "number") {
			ship.engineFire.sprite.tint = tint;
			ship.engineFire.light.tint = tint;
		}

		ship.sprite.addChild(ship.engineFire.sprite);
		ship.sprite.addChild(ship.engineFire.light);
	}
};