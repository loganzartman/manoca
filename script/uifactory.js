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

		var texNormal = either(params.buttonNormal,UIFactory.textures.buttonNormal),
			texDown   = either(params.buttonDown,UIFactory.textures.buttonDown),
			texHover  = either(params.buttonHover,UIFactory.textures.buttonHover);

		function btnUp() {
			btn.isdown = false;
			btn.setTexture(texNormal);
			btn.label.position = new PIXI.Point(8,6);
		}
		function btnDown() {
			btn.isdown = true;
			btn.setTexture(texDown);
			btn.label.position = new PIXI.Point(8,10);
		}
		function btnHover() {
			btn.setTexture(texHover);
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
				"font": "18pt 'Titillium Web'",
				"fill": "black"
			});
			btn.label = label;
			btn.addChild(label);
		}

		btnUp();

		btn.depth = 1000;

		btn.setText = function(str) {
			btn.label.setText(str);
		}
		btn.setSize = function(sz) {
			btn.scale = new PIXI.Point(sz,1);
			btn.label.scale = new PIXI.Point(1/sz,1);
		}
		console.log(btn.scale);

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