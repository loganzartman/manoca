"use strict";

var MainMenu = {
	stage: null,

	titleTexture: null,

	init: function() {
		MainMenu.stage = new PIXI.Stage(0x000000, false);

		MainMenu.settingsButton = UIFactory.makeButton({
			text: "input",
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


		MainMenu.testButton = UIFactory.makeButton({
			text: "test",
			action: function() {
				console.log(MainMenu.testButton.count++);
				var sayings = [
					"turn down for what",
					"space race",
					"sup",
					"#manoca",
					"01001000 01001001"
				];
				MainMenu.testButton.setText(sayings.random());
			}
		});
		MainMenu.testButton.position = new PIXI.Point(Graphics.width*0.1, Graphics.height-248);
		MainMenu.testButton.setSize(1.5);

		MainMenu.titleTexture = PIXI.Texture.fromImage("img/title.png");
		var title = new PIXI.Sprite(MainMenu.titleTexture);
		title.position = new PIXI.Point(
			Graphics.width/2 - 450,
			0
		);
		title.depth = 2000;

		MainMenu.stage.addChild(MainMenu.startButton);
		MainMenu.stage.addChild(MainMenu.settingsButton);
		MainMenu.stage.addChild(MainMenu.testButton);
		MainMenu.stage.addChild(title);
		Starfield.speed = 0.1;
	}
};