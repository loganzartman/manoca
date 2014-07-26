"use strict";

var complimentBank = [""];
var insultBank = ["Ship destroyed.", "Not even close.", "Failure.", "Game over."];
var ScoreScreen = {
	stage: null,

	init: function() {
		ScoreScreen.stage = new PIXI.Stage(0x000000, false);

		//the button to go back to menu
		ScoreScreen.menuButton = UIFactory.makeButton({
			text: "Done",
			action: function() {
				Game.mainMenu();
			}
		});
		ScoreScreen.menuButton.position = new PIXI.Point(Graphics.width*0.1, Graphics.height-128);

		//the big text at the top
		var text = Game.score<=Game.dataStorage.highScore?
			 Level.completed?"Level complete.":insultBank[Math.floor(Math.random()*insultBank.length)]
			:complimentBank[Math.floor(Math.random()*complimentBank.length)] + "New high score.";
		var col = Game.score<=Game.dataStorage.highScore?"orange":"lime"

		ScoreScreen.response = new PIXI.Text(text, {
			font: "bold 90px 'Titillium Web'",
			fill: col,
			stroke: "black",
			align: "center",
			strokeThickness: 10
		});
		ScoreScreen.response.position = new PIXI.Point(Graphics.width/2-ScoreScreen.response.width/2,58);
		ScoreScreen.response.depth = 20000;

		//the scrap label
		ScoreScreen.scraptext = new PIXI.Text("scrap collected:", {
			font: "bold 25px 'Titillium Web'",
			fill: "white",
			stroke: "black",
			align: "center",
			strokeThickness: 3
		});
		ScoreScreen.scraptext.position = new PIXI.Point(Graphics.width/2-ScoreScreen.scraptext.width/2+300,368);
		ScoreScreen.scraptext.depth = 20000;

		//the scrap
		ScoreScreen.scrap = new PIXI.Text(Util.formatNumberCommas(Game.player.scrap), {
			font: "bold 90px 'Titillium Web'",
			fill: "lime",
			stroke: "black",
			align: "center",
			strokeThickness: 10
		});
		ScoreScreen.scrap.position = new PIXI.Point(Graphics.width/2-ScoreScreen.scrap.width/2+300,378);
		ScoreScreen.scrap.depth = 20000;

		//the score label
		ScoreScreen.text = new PIXI.Text("you scored:", {
			font: "bold 25px 'Titillium Web'",
			fill: "white",
			stroke: "black",
			align: "center",
			strokeThickness: 3
		});
		ScoreScreen.text.position = new PIXI.Point(Graphics.width/2-ScoreScreen.text.width/2-300,368);
		ScoreScreen.text.depth = 20000;

		//the score
		ScoreScreen.score = new PIXI.Text(Util.formatNumberCommas(Game.score), {
			font: "bold 90px 'Titillium Web'",
			fill: "yellow",
			stroke: "black",
			align: "center",
			strokeThickness: 10
		});
		ScoreScreen.score.position = new PIXI.Point(Graphics.width/2-ScoreScreen.score.width/2-300,378);
		ScoreScreen.score.depth = 20000;

		//the high score label
		ScoreScreen.highScoreText = new PIXI.Text("high score: ", {
			font: "bold 25px 'Titillium Web'",
			fill: "white",
			stroke: "black",
			align: "center",
			strokeThickness: 3
		});
		ScoreScreen.highScoreText.position = new PIXI.Point(Graphics.width/2-ScoreScreen.highScoreText.width/2,272);
		ScoreScreen.highScoreText.depth = 20000;

		//the high score
		ScoreScreen.highScore = new PIXI.Text(Util.formatNumberCommas(Game.dataStorage.highScore), {
			font: "bold 60px 'Titillium Web'",
			fill: "white",
			stroke: "black",
			align: "center",
			strokeThickness: 10
		});
		ScoreScreen.highScore.position = new PIXI.Point(Graphics.width/2-ScoreScreen.highScore.width/2,288);
		ScoreScreen.highScore.depth = 20000;

		ScoreScreen.stage.addChild(ScoreScreen.menuButton);
		ScoreScreen.stage.addChild(ScoreScreen.text);
		ScoreScreen.stage.addChild(ScoreScreen.score);
		ScoreScreen.stage.addChild(ScoreScreen.scraptext);
		ScoreScreen.stage.addChild(ScoreScreen.scrap);
		ScoreScreen.stage.addChild(ScoreScreen.highScoreText);
		ScoreScreen.stage.addChild(ScoreScreen.highScore);
		ScoreScreen.stage.addChild(ScoreScreen.response);

	}
};
