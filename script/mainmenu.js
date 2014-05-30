"use strict";

var MainMenu = {
	stage: null,

	titleTexture: null,

	init: function() {
		MainMenu.stage = new PIXI.Stage(0x000000, false);

		var settingsButton = UIFactory.makeButton({
			text: "input",
			action: function() {
				Game.settings();
			}
		});
		settingsButton.position = new PIXI.Point(Graphics.width*0.1, Graphics.height-188);

		var startButton = UIFactory.makeButton({
			text: "start",
			action: function() {
				Game.restart();
			}
		});
		startButton.position = new PIXI.Point(Graphics.width*0.1, Graphics.height-128);
		startButton.tint = 0x11AA11;

		var testButton = UIFactory.makeButton({
			text: "test",
			action: function() {
				console.log(testButton.count++);
			}
		});
		testButton.position = new PIXI.Point(Graphics.width*0.1, Graphics.height-248);

		MainMenu.titleTexture = PIXI.Texture.fromImage("img/title.png");
		var title = new PIXI.Sprite(MainMenu.titleTexture);
		title.position = new PIXI.Point(
			Graphics.width/2 - 450,
			0
		);
		title.depth = 2000;

		MainMenu.stage.addChild(startButton);
		MainMenu.stage.addChild(settingsButton);
		MainMenu.stage.addChild(testButton);
		MainMenu.stage.addChild(title);
		Starfield.speed = 0.1;
	}
};