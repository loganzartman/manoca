"use strict";

var UIFactory = {
	margin: 32,

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

		var lblx = 8, lbly = 10;
		btn.label = {};
		function btnUp() {
			btn.isdown = false;
			btn.setTexture(texHover);
			btn.label.position = new PIXI.Point(lblx,lbly);
		}
		function btnDown() {
			btn.isdown = true;
			btn.setTexture(texDown);
			btn.label.position = new PIXI.Point(lblx,lbly+4);
			Sound.play("click", 0.5);
		}
		function btnHover() {
			btn.setTexture(texHover);
			Sound.play("hover", 0.5);
		}
		function btnOut() {
			btn.setTexture(texNormal);
			btn.label.position = new PIXI.Point(lblx,lbly);
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
			btn.label = new PIXI.Text(params.text.toUpperCase(),{
				"font": "18pt 'Exo'",
				"fill": "white"
			});
			btn.addChild(btn.label);
		}

		btnOut();
		btn.isdown = false;

		btn.depth = 1000;

		btn.setText = function(str) {
			btn.label.setText(str.toUpperCase());
		}
		btn.setSize = function(sz) {
			btn.scale = new PIXI.Point(sz,1);
			btn.label.scale = new PIXI.Point(1/sz,1);
		}

		return btn;
	},

	makeLabeledInput: function(params) {
		var group = new PIXI.DisplayObjectContainer();

		var label = new PIXI.Text(params.labeltext, {
			font: "bold 18px 'Exo'",
			fill: "white",
			stroke: "black",
			align: "left",
			strokeThickness: 2
		});
		label.position = new PIXI.Point(params.x, params.y);
		label.depth = 20000;
		group.addChild(label);

		var button = UIFactory.makeButton({
			text: params.text,
			action: params.action
		});
		button.setSize(params.size);
		button.position = new PIXI.Point(
			label.width + UIFactory.margin,
			0
		);
		button.depth = 20000;
		group.addChild(button);

		group.setText = function(str) {
			button.setText(str);
			button.setSize((button.label.width+32)/button.texture.width);
		}
		group.setLabelText = function(str) {
			label.setText(str);
		}

		return group;
	},

	showStatus: function(params) {
		if (UIFactory.statustext instanceof PIXI.Text) UIFactory.hideStatus();
		if (UIFactory.statustimer) {
			clearTimeout(UIFactory.statustimer);
			UIFactory.statustimer = null;
		}

		UIFactory.statustext = new PIXI.Text(params.text,{
			"font": "18pt 'Exo'",
			"fill": "white",
			"stroke": "black",
			"strokeThickness": 2
		});
		UIFactory.statustext.position = new PIXI.Point(32,Graphics.height-64);
		UIFactory.statustext.depth = 20000;

		if (params.timeout) UIFactory.statustimer = setTimeout(UIFactory.hideStatus, params.timeout);
		
		var start = Game.time;
		Object.defineProperty(UIFactory.statustext, "alpha", {
			get: function() {
				return Math.sin((Game.time-start)/10)*0.4+0.6;
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