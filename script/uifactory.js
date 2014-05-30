"use strict";

var UIFactory = {
	init: function() {
		UIFactory.textures.buttonNormal = PIXI.Texture.fromImage("img/btnNormal.png");
		UIFactory.textures.buttonDown = PIXI.Texture.fromImage("img/btnDown.png");
		UIFactory.textures.buttonHover = PIXI.Texture.fromImage("img/btnHover.png");
	},

	makeButton: function(params) {
		var btn = new PIXI.Sprite(either(params.buttonNormal,UIFactory.textures.buttonNormal));
		btn.setInteractive(true);
		console.log(btn);

		function btnUp() {
			btn.isdown = false;
			btn.setTexture(either(params.buttonNormal,UIFactory.textures.buttonNormal));
			btn.label.position = new PIXI.Point(8,4);
		}
		function btnDown() {
			btn.isdown = true;
			btn.setTexture(either(params.buttonDown,UIFactory.textures.buttonDown));
			btn.label.position = new PIXI.Point(8,8);
		}
		function btnHover() {
			btn.setTexture(either(params.buttonHover,UIFactory.textures.buttonHover));
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
			btnUp();
		}
		btn.mouseover = function(data){
			btnHover();
		}

		if (typeof params.text === "string") {
			var label = new PIXI.Text(params.text,{
				"font": "24pt PT Sans",
				"fill": "black"
			});
			btn.label = label;
			btn.addChild(label);
		}

		btnUp();

		btn.depth = 1000;

		return btn;
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