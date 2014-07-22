"use strict";

var MainMenu = {
	stage: null,

	titleTexture: null,

	init: function() {
		MainMenu.stage = new PIXI.Stage(0x000000, false);
		if (Starfield.nebula) Starfield.nebula.setTexture(Starfield.nebulae[0]);

		MainMenu.shipIndex = 0;
		MainMenu.shipButton = UIFactory.makeButton({
			text: "ship: "+Player.ships[0].name,
			action: function() {
				MainMenu.shipIndex = (MainMenu.shipIndex+1)%Player.ships.length;
				MainMenu.shipButton.setText("ship: "+Player.ships[MainMenu.shipIndex].name);
			}
		});
		MainMenu.shipButton.position = new PIXI.Point(Graphics.width*0.1, Graphics.height-248);

		MainMenu.levelIndex = 0;
		MainMenu.levelButton = UIFactory.makeButton({
			text: "level: "+Levels[1].name,
			action: function() {
				MainMenu.levelIndex = (MainMenu.levelIndex+1)%(Levels.length-1);
				MainMenu.levelButton.setText("level: "+Levels[MainMenu.levelIndex+1].name);
			}
		});
		MainMenu.levelButton.position = new PIXI.Point(Graphics.width*0.1, Graphics.height-308);
		MainMenu.levelButton.setSize(1.2);

		MainMenu.settingsButton = UIFactory.makeButton({
			text: "input: mouse",
			action: function() {
				Game.settings();
			}
		});
		MainMenu.settingsButton.position = new PIXI.Point(Graphics.width*0.1, Graphics.height-188);

		MainMenu.startButton = UIFactory.makeButton({
			text: "start",
			action: function() {
				Game.restart(Levels[MainMenu.levelIndex+1]);
			}
		});
		MainMenu.startButton.position = new PIXI.Point(Graphics.width*0.1, Graphics.height-128);
		MainMenu.startButton.tint = 0x11AA11;

		MainMenu.titleTexture = PIXI.Texture.fromImage("img/title.png");
		var title = new PIXI.Sprite(MainMenu.titleTexture);
		title.position = new PIXI.Point(
			Graphics.width/2 - 450,
			0
		);
		title.depth = 2000;

		MainMenu.scraptext = new PIXI.Text("Scrap: "+Util.formatNumberCommas(Game.dataStorage.scrap), {
			font: "bold 30px 'Titillium Web'",
			fill: "white",
			stroke: "black",
			align: "left",
			strokeThickness: 2
		});
		MainMenu.scraptext.position = new PIXI.Point(Graphics.width-Graphics.width*0.1-MainMenu.scraptext.width,Graphics.height-308);
		MainMenu.scraptext.depth = 20000;

		MainMenu.highscore = new PIXI.Text("Highscore: "+Util.formatNumberCommas(Game.dataStorage.highScore), {
			font: "bold 30px 'Titillium Web'",
			fill: "white",
			stroke: "black",
			align: "left",
			strokeThickness: 2
		});
		MainMenu.highscore.position = new PIXI.Point(Graphics.width-Graphics.width*0.1-MainMenu.highscore.width,Graphics.height-268);
		MainMenu.highscore.depth = 20000;

		MainMenu.infotext = new PIXI.Text("manoca beta\nv."+Game.VERSION+"\npixi: "+PIXI.VERSION+"\nnondefault.net", {
			font: "bold 12px monospace",
			fill: "white",
			stroke: "black",
			align: "right",
			strokeThickness: 2
		});
		MainMenu.infotext.position = new PIXI.Point(Graphics.width-128,Graphics.height-88);
		MainMenu.infotext.depth = 20000;
		MainMenu.infotext.setInteractive(true);
		MainMenu.infotext.mouseover = function(data) {
			Graphics.canvas.style.cursor = "pointer";
		}
		MainMenu.infotext.mouseout = function(data) {
			Graphics.canvas.style.cursor = "default";
		}
		MainMenu.infotext.mouseup = MainMenu.infotext.touchend = function(data){
			window.open("http://nondefault.net/");
		}

		MainMenu.stage.addChild(MainMenu.scraptext);
		MainMenu.stage.addChild(MainMenu.highscore);
		MainMenu.stage.addChild(MainMenu.infotext);
		MainMenu.stage.addChild(MainMenu.startButton);
		MainMenu.stage.addChild(MainMenu.settingsButton);
		MainMenu.stage.addChild(MainMenu.shipButton);
		MainMenu.stage.addChild(MainMenu.levelButton);
		MainMenu.stage.addChild(title);
		Starfield.speed = 0.1;
	}
};