"use strict";

var SettingsScreen = {
	stage: null,
	margin: 32,

	init: function() {
		SettingsScreen.stage = new PIXI.Stage(0x000000);

		//Title
		SettingsScreen.titletext = new PIXI.Text("SETTINGS", {
			font: "bold 60px 'Exo'",
			fill: "white",
			stroke: "black",
			align: "left",
			strokeThickness: 4
		});
		SettingsScreen.titletext.position = new PIXI.Point(Graphics.width/2-SettingsScreen.titletext.width/2,20);
		SettingsScreen.titletext.depth = 20000;
		SettingsScreen.stage.addChild(SettingsScreen.titletext);

		//Menu button
		SettingsScreen.abortButton = UIFactory.makeButton({
			text: "Menu",
			action: function() {
				SettingsScreen.destroy();
				Game.mainMenu();
			}
		});
		SettingsScreen.abortButton.position = new PIXI.Point(
			SettingsScreen.margin*2,
			Graphics.height - SettingsScreen.margin*1 - SettingsScreen.abortButton.height + 16
		);
		SettingsScreen.abortButton.tint = 0x11FF11;
		SettingsScreen.abortButton.depth = 2002;
		SettingsScreen.stage.addChild(SettingsScreen.abortButton);

		//Gameplay settings
		SettingsScreen.gameplaySectionText = new PIXI.Text("Gameplay", {
			font: "bold 40px 'Exo'",
			fill: "yellow",
			stroke: "black",
			align: "left",
			strokeThickness: 4
		});
		SettingsScreen.gameplaySectionText.position = new PIXI.Point(
			Graphics.width/2+SettingsScreen.margin*1,
			SettingsScreen.margin*4
		);
		SettingsScreen.gameplaySectionText.depth = 20000;
		SettingsScreen.stage.addChild(SettingsScreen.gameplaySectionText);

		SettingsScreen.inputSelectButton = UIFactory.makeButton({
			text: "Input: "+(Input.movementMode===Input.modes.MOUSE?"Mouse":"Keyboard"),
			action: function() {
				if (Input.movementMode === Input.modes.MOUSE) {
					Input.movementMode = Input.modes.KEYBOARD;
					SettingsScreen.inputSelectButton.setText("Input: Keyboard");
				}
				else {
					Input.movementMode = Input.modes.MOUSE;
					SettingsScreen.inputSelectButton.setText("Input: Mouse");
				}
			}
		});
		SettingsScreen.inputSelectButton.setSize(2);
		SettingsScreen.inputSelectButton.position = new PIXI.Point(
			Graphics.width/2+SettingsScreen.margin*1,
			SettingsScreen.gameplaySectionText.height+SettingsScreen.margin*4
		);
		SettingsScreen.inputSelectButton.depth = 2002;
		SettingsScreen.stage.addChild(SettingsScreen.inputSelectButton);

		//Graphics settings
		SettingsScreen.graphicsSectionText = new PIXI.Text("Graphics", {
			font: "bold 40px 'Exo'",
			fill: "yellow",
			stroke: "black",
			align: "left",
			strokeThickness: 4
		});
		SettingsScreen.graphicsSectionText.position = new PIXI.Point(
			SettingsScreen.margin*2,
			SettingsScreen.margin*4
		);
		SettingsScreen.graphicsSectionText.depth = 20000;
		SettingsScreen.stage.addChild(SettingsScreen.graphicsSectionText);

		SettingsScreen.starfieldDensityButton = UIFactory.makeLabeledInput({
			"x": SettingsScreen.margin*2,
			"y": SettingsScreen.gameplaySectionText.height+SettingsScreen.margin*4,
			"labeltext": "Starfield Density",
			"text": Game.settings.starfieldDensity,
			"action": function() {
				var n = parseInt(prompt("Set starfield density (0 ~ 5000)", "3000"))
				if (n>=0 && n<=5000) Game.settings.starfieldDensity = n;
				SettingsScreen.starfieldDensityButton.setText("Starfield Density: "+Game.settings.starfieldDensity);
			}
		});
		SettingsScreen.starfieldDensityButton.depth = 2002;
		SettingsScreen.stage.addChild(SettingsScreen.starfieldDensityButton);
	},

	destroy: function() {
		SettingsScreen.stage.interactionManager.removeEvents();
	}
}