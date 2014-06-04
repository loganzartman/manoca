"use strict";

var ScoreScreen = {
	stage: null,

	init: function() {
		ScoreScreen.stage = new PIXI.Stage(0x000000, false);

		ScoreScreen.menuButton = UIFactory.makeButton({
			text: "Done",
			action: function() {
				Game.mainMenu();
			}
		});
		ScoreScreen.menuButton.position = new PIXI.Point(Graphics.width*0.1, Graphics.height-128);

		ScoreScreen.text = new PIXI.Text("you scored:", {
			font: "bold 25px 'Titillium Web'",
			fill: "white",
			stroke: "black",
			align: "center",
			strokeThickness: 3
		});
		ScoreScreen.text.position = new PIXI.Point(Graphics.width/2-ScoreScreen.text.width/2,188);
		ScoreScreen.text.depth = 20000;

		ScoreScreen.score = new PIXI.Text(Game.score, {
			font: "bold 180px 'Titillium Web'",
			fill: "yellow",
			stroke: "black",
			align: "center",
			strokeThickness: 20
		});
		ScoreScreen.score.position = new PIXI.Point(Graphics.width/2-ScoreScreen.score.width/2,168);
		ScoreScreen.score.depth = 20000;

		ScoreScreen.stage.addChild(ScoreScreen.menuButton);
		ScoreScreen.stage.addChild(ScoreScreen.text);
		ScoreScreen.stage.addChild(ScoreScreen.score);
	}
};