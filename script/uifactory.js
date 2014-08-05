"use strict";

var UIFactory = {
	init: function() {
		UIFactory.textures.buttonNormal = PIXI.Texture.fromImage("img/btnNormal.png");
		UIFactory.textures.buttonDown = PIXI.Texture.fromImage("img/btnDown.png");
		UIFactory.textures.buttonHover = PIXI.Texture.fromImage("img/btnHover.png");
	},

	makeButton: function(params) {
		var btn = new PIXI.Sprite(either(params.buttonNormal,UIFactory.textures.buttonNormal));
		btn.anchor = new PIXI.Point(30/220/2,30/79/2);
		btn.setInteractive(true);

		var texNormal = either(params.buttonNormal,UIFactory.textures.buttonNormal),
			texDown   = either(params.buttonDown,UIFactory.textures.buttonDown),
			texHover  = either(params.buttonHover,UIFactory.textures.buttonHover);

		function btnUp() {
			btn.isdown = false;
			btn.setTexture(texHover);
			btn.label.position = new PIXI.Point(8,6);
		}
		function btnDown() {
			btn.isdown = true;
			btn.setTexture(texDown);
			btn.label.position = new PIXI.Point(8,10);
			Sound.play("click", 0.5);
		}
		function btnHover() {
			btn.setTexture(texHover);
			Sound.play("coin", 0.5);
		}
		function btnOut() {
			btn.setTexture(texNormal);
			btn.label.position = new PIXI.Point(8,6);
		}

		btn.mousedown = btn.touchstart = function(data){
			btnDown();
		}
		btn.mouseup = btn.touchend = function(data){
			btnUp();
			if (typeof params.action === "function") {
				params.action(data);
			}
		}
		btn.mouseout = function(data){
			btnOut();
		}
		btn.mouseover = function(data){
			btnHover();
		}

		if (typeof params.text === "string") {
			var label = new PIXI.Text(params.text,{
				"font": "18pt 'Titillium Web'",
				"fill": "white"
			});
			btn.label = label;
			btn.addChild(label);
		}

		btnOut();
		btn.isdown = false;

		btn.depth = 1000;

		btn.setText = function(str) {
			btn.label.setText(str);
		}
		btn.setSize = function(sz) {
			btn.scale = new PIXI.Point(sz,1);
			btn.label.scale = new PIXI.Point(1/sz,1);
		}

		return btn;
	},

	showStatus: function(params) {
		UIFactory.statustext = new PIXI.Text(params.text,{
			"font": "18pt 'Titillium Web'",
			"fill": "white",
			"stroke": "black",
			"strokeThickness": 2
		});
		UIFactory.statustext.position = new PIXI.Point(32,Graphics.height-64);
		UIFactory.statustext.depth = 20000;

		Object.defineProperty(UIFactory.statustext, "alpha", {
			get: function() {
				return Math.sin(Game.time/10)*0.4+0.6;
			}
		});

		Graphics.activeStage.addChild(UIFactory.statustext);
	},

	hideStatus: function() {
		var ind = Graphics.activeStage.children.indexOf(UIFactory.statustext);
		if (ind>=0) {
			Graphics.activeStage.removeChild(UIFactory.statustext);
		}
	},

	makeTooltip: function(params) {
		var tt = new PIXI.Text(params.text, {
			"font": "24pt Oxygen",
			"fill": "white"

		});
	},

	textures: {
		buttonDown: null,
		buttonNormal: null,
		buttonHover: null
	}
};