"use strict";

var complimentBank = [""];
var insultBank = ["Ship destroyed.", "Not even close.", "Failure.", "Game over."];
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
		ScoreScreen.text.position = new PIXI.Point(Graphics.width/2-ScoreScreen.text.width/2,408);
		ScoreScreen.text.depth = 20000;

		ScoreScreen.score = new PIXI.Text(Game.score, {
			font: "bold 90px 'Titillium Web'",
			fill: "yellow",
			stroke: "black",
			align: "center",
			strokeThickness: 20
		});
		ScoreScreen.highScoreText = new PIXI.Text("high score: ", {
			font: "bold 25px 'Titillium Web'",
			fill: "white",
			stroke: "black",
			align: "center",
			strokeThickness: 3
		});

		var text = Game.score<=Game.dataStorage.highScore?
			 Level.completed?"Level complete.":insultBank[Math.floor(Math.random()*insultBank.length)]
			:complimentBank[Math.floor(Math.random()*complimentBank.length)] + "New high score.";
		var col = Game.score<=Game.dataStorage.highScore?"orange":"lime"

		ScoreScreen.response = new PIXI.Text(text, {
			font: "bold 90px 'Titillium Web'",
			fill: col,
			stroke: "black",
			align: "center",
			strokeThickness: 20
		});
		ScoreScreen.highScore = new PIXI.Text(Game.dataStorage.highScore, {
			font: "bold 60px 'Titillium Web'",
			fill: "white",
			stroke: "black",
			align: "center",
			strokeThickness: 20
		});

		ScoreScreen.score.position = new PIXI.Point(Graphics.width/2-ScoreScreen.score.width/2,418);
		ScoreScreen.score.depth = 20000;

		ScoreScreen.highScoreText.position = new PIXI.Point(Graphics.width/2-ScoreScreen.highScoreText.width/2,272);
		ScoreScreen.highScoreText.depth = 20000;

		ScoreScreen.highScore.position = new PIXI.Point(Graphics.width/2-ScoreScreen.highScore.width/2,288);
		ScoreScreen.highScore.depth = 20000;

		ScoreScreen.response.position = new PIXI.Point(Graphics.width/2-ScoreScreen.response.width/2,58);
		ScoreScreen.response.depth = 20000;

		ScoreScreen.stage.addChild(ScoreScreen.menuButton);
		ScoreScreen.stage.addChild(ScoreScreen.text);
		ScoreScreen.stage.addChild(ScoreScreen.score);
		ScoreScreen.stage.addChild(ScoreScreen.highScoreText);
		ScoreScreen.stage.addChild(ScoreScreen.highScore);
		ScoreScreen.stage.addChild(ScoreScreen.response);

	}
};
