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

		ShipSelect.startButton = UIFactory.makeButton({
			text: "Launch",
			action: function() {
				if (Profile.shipUnlocked(Game.profile, ShipSelect.selected)) {
					Game.restart(level);
				}
				else {
					if (Game.profile.scrap>=ShipSelect.selected.cost) {
						if (confirm("Build "+ShipSelect.selected.name+" for "+ShipSelect.selected.cost+"?")) {
							Game.profile.scrap -= ShipSelect.selected.cost;
							Profile.addShip(Game.profile,ShipSelect.selected);
							Profile.save(Game.profile);

							Game.shipSelect(level);
						}
					}
					else {
						alert("Not enough scrap to build.");
					}
				}
			}
		});
		ShipSelect.startButton.position = new PIXI.Point(
			ShipSelect.margin*2,
			Graphics.height - ShipSelect.margin*2 - ShipSelect.startButton.height -8
		);
		ShipSelect.startButton.tint = 0x11AA11;
		ShipSelect.startButton.depth = 2002;
		ShipSelect.stage.addChild(ShipSelect.startButton);

		ShipSelect.abortButton = UIFactory.makeButton({
			text: "Abort",
			action: function() {
				Game.mainMenu();
			}
		});
		ShipSelect.abortButton.position = new PIXI.Point(
			ShipSelect.margin*2,
			Graphics.height - ShipSelect.margin*1 - ShipSelect.abortButton.height + 16
		);
		ShipSelect.abortButton.tint = 0xFF1111;
		ShipSelect.abortButton.depth = 2002;
		ShipSelect.stage.addChild(ShipSelect.abortButton);

		ShipSelect.updateSelected(ShipSelect.selected);

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
		var unlocked = Profile.shipUnlocked(Game.profile, ship);

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

		if (!unlocked) {
			var cost = new PIXI.Text(Util.formatNumberCommas(ship.cost), {
				"font": "18pt 'Titillium Web'",
				"fill": Game.profile.scrap>=ship.cost?"lime":"red",
				"stroke": "black",
				"strokeThickness": 2
			});
			cost.depth = 2001;
			cost.position = new PIXI.Point(
				Graphics.width - ShipSelect.margin*2 - cost.width,
				sprite.position.y + sprite.height/2 - name.height/2
			);
			ShipSelect.stage.addChild(cost);
		}

		var btn = new PIXI.Graphics();
		btn.lineStyle(2,unlocked?0xf7cf7b:0xFF0505,1);
		btn.tgtalpha = 0.1;
		btn.beginFill(unlocked?0xf7cf7b:0x777777);
		var bw = Graphics.width - ShipSelect.margin - x,
			bh = sprite.height + ShipSelect.margin/2;
		btn.drawRect(x, y, bw, bh);
		btn.hitArea = new PIXI.Rectangle(x, y, bw, bh);
		btn.setInteractive(true);
		btn.mousedown = btn.touchstart = function() {
			Sound.play("click", 0.5);
			ShipSelect.selected = ship;
			ShipSelect.updateSelected(ship);
		}
		btn.mouseover = function() {
			btn.tgtalpha = btn._curalpha = 0.5;
			Sound.play("hover", 0.5);
		}
		btn.mouseout = btn.touchend = function() {
			btn.tgtalpha = 0.1;
		}

		Object.defineProperty(btn, "alpha", {
			get: function() {
				var step = 0.02;
				if (!this._curalpha) this._curalpha = this.tgtalpha||1;
				if (this._curalpha+step<=this.tgtalpha) this._curalpha+=step;
				else if (this._curalpha-step>=this.tgtalpha) this._curalpha-=step;
				else this._curalpha = this.tgtalpha;
				return this._curalpha;
			}
		});

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
			ShipSelect.margin*3 + Math.max(ShipSelect.shipSprite.height,200)
		);
		var specs = "";
		specs += "Acceleration: "+ship.accel + "\n";
		specs += "Top speed: "+ship.top + "\n";
		specs += "Rotation speed: "+(Math.round(ship.srot*10)) + "\n";
		specs += "Hull strength: "+ship.health + "\n";

		var dps = 0;
		for (var i = ship.mounts.length - 1; i >= 0; i--) {
			dps += (ship.mounts[i].type.damage*60)/ship.mounts[i].type.delay;
		};
		specs += "Damage/second: "+dps.toFixed(2)+"\n";

		ShipSelect.shipSpecs.setText(specs);

		if (Profile.shipUnlocked(Game.profile, ship)) {
			ShipSelect.startButton.setText("Launch");
		}
		else {
			ShipSelect.startButton.setText("Build Ship");
		}
	}
}