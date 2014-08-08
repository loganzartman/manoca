"use strict";

var Starmap = {
	stage: null,
	margin: 32,
	starBaseX: Graphics.width/4,
	starBaseY: Graphics.height/2,
	starSpacingX: 300,
	selected: Levels[1],
	starCoreTexture: PIXI.Texture.fromImage("img/star-core.png"),
	starGlowTexture: PIXI.Texture.fromImage("img/star-glow.png"),
	_scrollWidth: Graphics.width,
	_scrollX: 0,
	_scrollSpeedX: 0,
	_lmx: null,
	_lmy: null,
	_mouseDown: false,
	//used for starmap generation
	_numLevels: 0,
	_rand: null,
	_lastStar: null,
	_stars: [],

	init: function() {
		Starmap.stage = new PIXI.Stage(0x000000, false);
		if (Starfield.nebula) Starfield.nebula.setTexture(PIXI.Texture.fromImage("img/nebula3.png"));
		Starfield.speed = -0.01;

		Starmap._scrollWidth= Graphics.width;
		Starmap._scrollX= 0;
		Starmap._scrollSpeedX= 0;
		Starmap._lmx= 0;
		Starmap._lmy= 0;
		Starmap._mouseDown= false;
		Starmap._rand= new Random(426780897);

		Starmap.titletext = new PIXI.Text("STARMAP", {
			font: "bold 60px 'Exo'",
			fill: "white",
			stroke: "black",
			align: "left",
			strokeThickness: 4
		});
		Starmap.titletext.position = new PIXI.Point(Graphics.width/2-Starmap.titletext.width/2,20);
		Starmap.titletext.depth = 20000;
		Starmap.stage.addChild(Starmap.titletext);

		Starmap.abortButton = UIFactory.makeButton({
			text: "Abort",
			action: function() {
				Starmap.destroy();
				Game.mainMenu();
			}
		});
		Starmap.abortButton.position = new PIXI.Point(
			Starmap.margin*2,
			Graphics.height - Starmap.margin*1 - Starmap.abortButton.height + 16
		);
		Starmap.abortButton.tint = 0xFF1111;
		Starmap.abortButton.depth = 2002;
		Starmap.stage.addChild(Starmap.abortButton);

		Starmap.starContainer = new PIXI.DisplayObjectContainer();
		Starmap.starContainer.position = new PIXI.Point(0,0);
		Object.defineProperty(Starmap.starContainer, "position", {
			get: function() {
				Starmap._scrollX += Starmap._scrollSpeedX;
				Starmap._scrollSpeedX = Starmap._scrollSpeedX*0.8;

				//screw with the starfield until it does what we want
				Starfield.speed = Starmap._scrollSpeedX*0.01;
				Starfield.frame();
				Starfield.speed = -0.01;
				Starfield.offset.x = Starmap._scrollX/(Starmap._scrollWidth-Graphics.width)*100;

				//clipping
				if (Starmap._scrollX<0) {
					Starmap._scrollX=0;
					Starmap._scrollSpeedX=0;
				}
				if (Starmap._scrollX>Starmap._scrollWidth-Graphics.width) {
					Starmap._scrollX = Starmap._scrollWidth-Graphics.width;
					Starmap._scrollSpeedX=0;
				}

				return new PIXI.Point(-Starmap._scrollX, 0);
			}
		});

		//mouse dragging events
		Starmap.starContainer.mousedown = Starmap.starContainer.touchstart = function(event) {
			Starmap._mouseDown = true;
			var cursor = event.global;
			Starmap._lmx = cursor.x;
			Starmap._lmy = cursor.y;
		}
		Starmap.starContainer.mousemove = Starmap.starContainer.touchmove = function(event){
			var cursor = event.global;
			if (Starmap._mouseDown) {
				var dx = cursor.x-Starmap._lmx,
					dy = cursor.y-Starmap._lmy;
				Starmap._scrollSpeedX = -dx;
			}

			if (dx) {
				Starmap._lmx = cursor.x;
				Starmap._lmy = cursor.y;
			}
		}
		Starmap.starContainer.mouseup = Starmap.starContainer.touchend = function(event){
			var cursor = event.global;
			Starmap._mouseDown = false;
			Starmap._lmx = cursor.x;
			Starmap._lmy = cursor.y;
		}

		Starmap.stage.addChild(Starmap.starContainer);

		Starmap.graphics = new PIXI.Graphics();
		Starmap.graphics.depth = 2001;
		Starmap.starContainer.addChild(Starmap.graphics);

		Starmap._lastStar = null;
		Starmap._numLevels = 0;
		Starmap._stars = [];

		for (var i = 1; i < Levels.length; i++) {
			Starmap.addLevel(Levels[i]);
		}

		//interactivity setup
		Starmap.starContainer.setInteractive(true);
		Starmap.starContainer.hitArea = new PIXI.Rectangle(0,0,Starmap._scrollWidth,Graphics.height);
		Starmap._scrollX = 0;

	},

	addLevel: function(level) {

		//create star core, which is the parent sprite
		var starCore = new PIXI.Sprite(Starmap.starCoreTexture);
		starCore.setInteractive(true);
		starCore.anchor = new PIXI.Point(0.5,0.5);
		starCore.position = new PIXI.Point(
			Starmap.starBaseX + Starmap._numLevels*Starmap.starSpacingX + Starmap._rand.next(-Starmap.starSpacingX/4,Starmap.starSpacingX/4),
			Starmap.starBaseY + Starmap._rand.next(-Starmap.starBaseY/3,Starmap.starBaseY/2)
		);
		starCore.blendMode = PIXI.blendModes.NORMAL;
		starCore.depth = 2000;
		var size = Starmap._rand.next(0.5,0.8);
		starCore.scale = new PIXI.Point(size,size);
		starCore.rotation = Starmap._rand.next(0,Math.PI*2);
		starCore.tint = Starmap._rand.next(0x000000,0xFFFFFF);

		//create the warp button
		var btn = UIFactory.makeButton({
			text: "Warp",
			action: function() {
				Starmap.destroy();
				Game.shipSelect(level);
			}
		});
		btn.setSize(0.5);
		btn.depth = 20000;
		btn.position = new PIXI.Point(starCore.position.x - btn.width*0.4, starCore.position.y + starCore.height*0.6);
		Starmap.starContainer.addChild(btn);

		//create the level info text
		var info = new PIXI.Text(level.name, {
			font: "bold 40px 'Exo'",
			fill: "white",
			stroke: "black",
			align: "left",
			strokeThickness: 2
		});
		info.position = new PIXI.Point(starCore.position.x - info.width*0.5, starCore.position.y - starCore.height*0.78);
		info.depth = 20000;
		Starmap.starContainer.addChild(info);

		//create the highlight circle thing
		var circle = new PIXI.Graphics();
		circle.lineStyle(1, 0xFFFFFF, 0.5);
		circle.beginFill(0xFFFFFF,0);
		circle.drawCircle(starCore.position.x, starCore.position.y, starCore.width*0.5);
		circle.endFill();
		Starmap.starContainer.addChild(circle);

		//set up interactivity
		var selected = true;
		starCore.hide = function() {
			selected = false;
			circle.alpha = 0;
			info.setInteractive(false);
			info.alpha = 0;
			btn.setInteractive(false);
			btn.alpha = 0;
		}
		if (Starmap.selected !== level) starCore.hide();

		starCore.click = starCore.tap = function() {
			selected = true;
			circle.alpha = 1;
			info.setInteractive(true);
			info.alpha = 1;
			btn.setInteractive(true);
			btn.alpha = 1;

			Starmap.selected = level;

			for (var i = Starmap._stars.length - 1; i >= 0; i--) {
				if (Starmap._stars[i]!==starCore) Starmap._stars[i].hide();
			}
		}

		starCore.mouseover = function() {
			if (!selected) {
				Sound.play("hover");
				info.alpha = 0.5;
				circle.alpha = 0.5;
			}
		}
		starCore.mouseout = function() {
			if (!selected) {
				info.alpha = 0;
				circle.alpha = 0;
			}
		}

		//create the star glow
		var starGlow = new PIXI.Sprite(Starmap.starGlowTexture);
		starGlow.blendMode = PIXI.blendModes.ADD;
		starGlow.anchor = new PIXI.Point(0.5,0.5);
		starGlow.rotation = Starmap._rand.next(0,Math.PI*2);

		//add animation
		var coreRotOffset = Starmap._rand.next(0,Math.PI*2);
		var coreRotSpd = Starmap._rand.next(-0.01,0.01);
		Object.defineProperty(starCore, "rotation", {
			get: function() {
				return (Game.time*coreRotSpd + coreRotOffset) % (Math.PI*2);
			}
		});

		var glowRotOffset = Starmap._rand.next(0,Math.PI*2);
		var glowRotSpd = Starmap._rand.next(-0.01,0.01);
		Object.defineProperty(starGlow, "rotation", {
			get: function() {
				return (-Game.time*coreRotSpd + Game.time*glowRotSpd + glowRotOffset) % (Math.PI*2);
			}
		});

		Starmap._scrollWidth = starCore.position.x + Graphics.width/2;

		starCore.addChild(starGlow);
		Starmap.starContainer.addChild(starCore);

		//draw connecting lines
		if (Starmap._lastStar) {
			var dx = starCore.position.x - Starmap._lastStar.position.x,
				dy = starCore.position.y - Starmap._lastStar.position.y;
			var dir = Math.atan2(dy,dx);

			var pos1 = new PIXI.Point(
				Starmap._lastStar.position.x + Math.cos(dir)*Starmap._lastStar.width*0.5,
				Starmap._lastStar.position.y + Math.sin(dir)*Starmap._lastStar.width*0.5
			);

			var pos2 = new PIXI.Point(
				starCore.position.x - Math.cos(dir)*starCore.width*0.5,
				starCore.position.y - Math.sin(dir)*starCore.width*0.5
			);

			Starmap.graphics.lineStyle(1,0xFFFFFF,0.5);
			Starmap.graphics.moveTo(pos1.x,pos1.y);
			Starmap.graphics.lineTo(pos2.x,pos2.y);
		}

		Starmap._stars.push(starCore);

		Starmap._lastStar = starCore;

		Starmap._numLevels++;
	},

	/**
	 * Solves some interaction issues.  Call whenever transitioning to another stage.
	 */
	destroy: function() {
		Starmap.stage.interactionManager.removeEvents();
	}
}