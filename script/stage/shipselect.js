"use strict";

var ShipSelect = {
	stage: null,
	margin: 32,
	selected: Player.ships[1],

	init: function(level) {
		ShipSelect.stage = new PIXI.Stage(0x000000, false);
		if (Starfield.nebula) Starfield.nebula.setTexture(Starfield.nebulae[0]);

		//Selected Ship UI
		ShipSelect.selectedUI = new PIXI.Graphics();
		ShipSelect.selectedUI.lineStyle(2,0xf7cf7b,1);
		ShipSelect.selectedUI.alpha = 0.3;
		ShipSelect.selectedUI.beginFill(0xf7cf7b);
		ShipSelect.selectedUI.drawRect(
			ShipSelect.margin,
			ShipSelect.margin,
			Graphics.width/2 - ShipSelect.margin*2,
			Graphics.height - ShipSelect.margin*2
		);
		ShipSelect.selectedUI.endFill();
		ShipSelect.selectedUI.depth = 2000;

		ShipSelect.shipSprite = new PIXI.Sprite(Graphics.texture.none);
		ShipSelect.shipSprite.position = new PIXI.Point(ShipSelect.margin*2, ShipSelect.margin*2);
		ShipSelect.shipSprite.scale = new PIXI.Point(1.5,1.5);
		ShipSelect.shipSprite.depth = 2001;
		ShipSelect.stage.addChild(ShipSelect.shipSprite);

		ShipSelect.shipName = new PIXI.Text("name", {
			"font": "30pt 'Titillium Web'",
			"fill": "white",
			"stroke": "black",
			"strokeThickness": 4
		});
		ShipSelect.shipName.depth = 2001;
		ShipSelect.stage.addChild(ShipSelect.shipName);

		ShipSelect.shipSpecs = new PIXI.Text("name", {
			"font": "18pt 'Titillium Web'",
			"fill": "white",
			"stroke": "black",
			"strokeThickness": 2
		});
		ShipSelect.shipSpecs.depth = 2001;
		ShipSelect.stage.addChild(ShipSelect.shipSpecs);

		ShipSelect.updateSelected(Player.ships[1]);

		ShipSelect.startButton = UIFactory.makeButton({
			text: "Launch",
			action: function() {
				Game.restart(level);
			}
		});
		ShipSelect.startButton.position = new PIXI.Point(
			ShipSelect.margin*2,
			Graphics.height - ShipSelect.margin*2 - ShipSelect.startButton.height
		);
		ShipSelect.stage.addChild(ShipSelect.startButton);

		//Ship List
		var x=Graphics.width/2+ShipSelect.margin,
			y=ShipSelect.margin;
		for (var i = 1; i < Player.ships.length; i++) {
			ShipSelect.addListItem(
				Player.ships[i], 
				x,
				y
			);
			y += Player.ships[i].texture.height * 0.75 + ShipSelect.margin;
		};

		ShipSelect.stage.addChild(ShipSelect.selectedUI);
	},

	addListItem: function(ship,x,y) {
		var sprite = new PIXI.Sprite(ship.texture);
		sprite.scale = new PIXI.Point(0.75,0.75);
		sprite.position = new PIXI.Point(x+ShipSelect.margin/2,y+ShipSelect.margin/4);
		sprite.depth = 2001;

		var name = new PIXI.Text(ship.name, {
			"font": "18pt 'Titillium Web'",
			"fill": "white",
			"stroke": "black",
			"strokeThickness": 2
		});
		name.depth = 2001;
		name.position = new PIXI.Point(
			sprite.position.x + Math.max(96,sprite.width) + 16,
			sprite.position.y + sprite.height/2 - name.height/2
		);

		var btn = new PIXI.Graphics();
		btn.lineStyle(2,0xf7cf7b,1);
		btn.alpha = 0.1;
		btn.beginFill(0xf7cf7b);
		var bw = Graphics.width - ShipSelect.margin - x,
			bh = sprite.height + ShipSelect.margin/2;
		btn.drawRect(x, y, bw, bh);
		btn.hitArea = new PIXI.Rectangle(x, y, bw, bh);
		btn.setInteractive(true);
		btn.mousedown = function() {
			ShipSelect.selected = ship;
			ShipSelect.updateSelected(ship);
		}

		btn.mouseover = function() {
			btn.alpha = 0.5;
		}
		btn.mouseout = function() {
			btn.alpha = 0.1;
		}

		ShipSelect.stage.addChild(btn);
		ShipSelect.stage.addChild(sprite);
		ShipSelect.stage.addChild(name);
	},

	updateSelected: function(ship) {
		if (!ship) ship = Player.ships[0];

		ShipSelect.shipSprite.setTexture(ship.texture);
		ShipSelect.shipName.setText(ship.name);
		ShipSelect.shipName.position = new PIXI.Point(
			Graphics.width/2 - ShipSelect.margin*2 - ShipSelect.shipName.width,
			ShipSelect.margin + ShipSelect.shipSprite.height/2
		);

		ShipSelect.shipSpecs.position = new PIXI.Point(
			ShipSelect.margin*2,
			ShipSelect.margin*3 + ShipSelect.shipSprite.height
		);
		var specs = "";
		specs += "Acceleration: "+ship.accel + "\n";
		specs += "Top speed: "+ship.top + "\n";
		specs += "Drag: "+(~~(ship.fric*100)) + "\n";
		specs += "Rotation speed: "+(~~(ship.srot*100)) + "\n";
		specs += "Hull strength: "+ship.health + "\n";
		ShipSelect.shipSpecs.setText(specs);
	}
}