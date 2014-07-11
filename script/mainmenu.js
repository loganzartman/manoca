"use strict";

var MainMenu = {
	stage: null,

	titleTexture: null,

	init: function() {
		MainMenu.stage = new PIXI.Stage(0x000000, false);

		MainMenu.shipIndex = 0;
		MainMenu.shipButton = UIFactory.makeButton({
			text: "ship: "+Player.ships[0].name,
			action: function() {
				MainMenu.shipIndex = (MainMenu.shipIndex+1)%Player.ships.length;
				MainMenu.shipButton.setText("ship: "+Player.ships[MainMenu.shipIndex].name);
			}
		});
		MainMenu.shipButton.position = new PIXI.Point(Graphics.width*0.1, Graphics.height-248);

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
				Game.restart();
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

		MainMenu.infotext = new PIXI.Text("manoca beta\nv."+Game.VERSION+"\nnondefault.net", {
			font: "bold 12px monospace",
			fill: "white",
			stroke: "black",
			align: "right",
			strokeThickness: 3
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

		MainMenu.stage.addChild(MainMenu.infotext);
		MainMenu.stage.addChild(MainMenu.startButton);
		MainMenu.stage.addChild(MainMenu.settingsButton);
		MainMenu.stage.addChild(MainMenu.shipButton);
		MainMenu.stage.addChild(title);
		Starfield.speed = 0.1;
	}
};