"use strict";

var complimentBank = ["Great job! New High Score!", "Awesome! New High Score!", "Amazing! New High Score!", "Fantastic! New High Score!"];
var insultBank = ["You can do better!", "That all you got?", "Are you even trying?", "Try again!"];
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

		

		ScoreScreen.highScore = new PIXI.Text(localStorage.highScore, {
			font: "bold 90px 'Titillium Web'",
			fill: "yellow",
			stroke: "black",
			align: "center",
			strokeThickness: 20
		});

		if(Game.score <= localStorage.highScore){
			ScoreScreen.response = new PIXI.Text(insultBank[Math.floor(Math.random()*insultBank.length)], {
			font: "bold 90px 'Titillium Web'",
			fill: "yellow",
			stroke: "black",
			align: "center",
			strokeThickness: 20
		});
		}else{
			ScoreScreen.response = new PIXI.Text(complimentBank[Math.floor(Math.random()*complimentBank.length)], {
			font: "bold 90px 'Titillium Web'",
			fill: "yellow",
			stroke: "black",
			align: "center",
			strokeThickness: 20
		});
			ScoreScreen.highScore = new PIXI.Text(Game.score, {
			font: "bold 90px 'Titillium Web'",
			fill: "yellow",
			stroke: "black",
			align: "center",
			strokeThickness: 20
		});

		}
		ScoreScreen.score.position = new PIXI.Point(Graphics.width/2-ScoreScreen.score.width/2,418);
		ScoreScreen.score.depth = 20000;

		ScoreScreen.highScoreText.position = new PIXI.Point(Graphics.width/2-ScoreScreen.highScoreText.width/2,208);
		ScoreScreen.highScoreText.depth = 20000;

		ScoreScreen.highScore.position = new PIXI.Point(Graphics.width/2-ScoreScreen.highScore.width/2,218);
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
