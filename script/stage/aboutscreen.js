"use strict";

var AboutScreen = {
	stage: null,
	margin: 32,

	init: function() {
		AboutScreen.stage = new PIXI.Stage(0x000000);

		//Title
		AboutScreen.titletext = new PIXI.Text("ABOUT", {
			font: "bold 60px 'Exo'",
			fill: "white",
			stroke: "black",
			align: "left",
			strokeThickness: 4
		});
		AboutScreen.titletext.position = new PIXI.Point(Graphics.width/2-AboutScreen.titletext.width/2,20);
		AboutScreen.titletext.depth = 20000;
		AboutScreen.stage.addChild(AboutScreen.titletext);

		//Menu button
		AboutScreen.abortButton = UIFactory.makeButton({
			text: "Menu",
			action: function() {
				AboutScreen.destroy();
				Game.mainMenu();
			}
		});
		AboutScreen.abortButton.position = new PIXI.Point(
			AboutScreen.margin*2,
			Graphics.height - AboutScreen.margin*1 - AboutScreen.abortButton.height + 16
		);
		AboutScreen.abortButton.tint = 0x11FF11;
		AboutScreen.abortButton.depth = 2002;
		AboutScreen.stage.addChild(AboutScreen.abortButton);

		//title
		AboutScreen.titleText = new PIXI.Text("Manoca - created by Nondefault.net", {
			font: "bold 40px 'Exo'",
			fill: "white",
			stroke: "black",
			align: "left",
			strokeThickness: 4
		});
		AboutScreen.titleText.position = new PIXI.Point(
			Graphics.width/2 - AboutScreen.titleText.width/2,
			AboutScreen.margin*3
		);
		AboutScreen.titleText.depth = 20000;
		AboutScreen.stage.addChild(AboutScreen.titleText);

		//About
		AboutScreen.licenseText = new PIXI.Text("Manoca is licensed under the\nCreative Commons Attribution-NonCommercial-ShareAlike 4.0 International License\nMore info at http://nondefault.net/about", {
			font: "bold 20px 'Exo'",
			fill: "yellow",
			stroke: "black",
			align: "left",
			strokeThickness: 2
		});
		AboutScreen.licenseText.position = new PIXI.Point(
			AboutScreen.margin*2,
			AboutScreen.margin*6
		);
		AboutScreen.licenseText.depth = 20000;
		AboutScreen.stage.addChild(AboutScreen.licenseText);

		//Credits
		AboutScreen.creditsTitle = new PIXI.Text("Credits", {
			font: "bold 26px 'Exo'",
			fill: "white",
			stroke: "black",
			align: "left",
			strokeThickness: 2
		});
		AboutScreen.creditsTitle.position = new PIXI.Point(
			AboutScreen.margin*2,
			AboutScreen.licenseText.position.y + AboutScreen.licenseText.height + AboutScreen.margin*2
		);
		AboutScreen.creditsTitle.depth = 20000;
		AboutScreen.stage.addChild(AboutScreen.creditsTitle);

		//Credits text
		AboutScreen.creditsText = new PIXI.Text("Player ship graphics - KenNL\nEnemy ship graphics - KenNL\nAll other assets by Nondefault", {
			font: "bold 18px 'Exo'",
			fill: "white",
			stroke: "black",
			align: "left",
			strokeThickness: 2
		});
		AboutScreen.creditsText.position = new PIXI.Point(
			AboutScreen.margin*2,
			AboutScreen.creditsTitle.position.y + AboutScreen.creditsTitle.height
		);
		AboutScreen.creditsText.depth = 20000;
		AboutScreen.stage.addChild(AboutScreen.creditsText);
	},

	destroy: function() {
		AboutScreen.stage.interactionManager.removeEvents();
	}
}