"use strict";

var Scrap = Entity.extend(function(props){
	this.value = either(props.value,~~Random.next(2,10));

	this.friction = 0.1;
	this.sprite = new PIXI.Sprite(Scrap.texture);
	this.sprite.blendMode = PIXI.blendModes.ADD;
	var scaleval = 0.3+(this.value/10)*0.8
	this.sprite.scale = new PIXI.Point(scaleval, scaleval);
	Scrap.col = (Scrap.col+0.001)%1;
	this.col = Scrap.col;
	this.sprite.anchor = new PIXI.Point(0.5,0.5);
	this.sprite.depth = 900;
	this.updateSprite();
	Graphics.stage.addChild(this.sprite);
})
.statics({
	col: 0,
	texture: PIXI.Texture.fromImage("img/scrap.png"),
	make: function(props) {
		var val = either(props.value, undefined);
		var x = either(props.x, Game.player.x),
			y = either(props.y, Game.player.y);
		var maxxs = either(props.xs, 5),
			maxys = either(props.ys, 5);
		var count = either(props.count, 1);

		for (var i=0; i<count; i++) {
			if (props.entity) {
				x = props.entity.x + Random.next(-props.entity.sprite.width/2, props.entity.sprite.width/2);
				y = props.entity.y + Random.next(-props.entity.sprite.height/2, props.entity.sprite.height/2);
			}
			
			Game.entities.push(new Scrap({
				"x": x, 
				"y": y, 
				"xs": Random.next(-maxxs,maxxs),
				"ys": Random.next(-maxys,maxys),
				"texture": Scrap.texture
			}));
		}
	}
})
.methods({
	updateSprite: function() {
		this.sprite.position = new PIXI.Point(
			this.x,
			this.y
		);
		this.sprite.tint = Util.hsl2rgb((this.col)%1,1,0.5);
		this.col += 0.01;
	},
	step: function() {
		this.supr();

		if (!this.inBounds({"x1": 0})) {
			this.destroy();
		}
		if (this.distanceTo(Game.player)<Game.player.sprite.width/2) {
			this.destroy();
			Game.player.scrap += this.value;
		}

		var pdist = this.distanceTo(Game.player);
		if (pdist<=Game.player.attractorRange) {
			var force = ((Game.player.attractorRange-pdist)/Game.player.attractorRange)*Game.player.attractorStrength;
			var dir = this.directionTo(Game.player);
			this.xs += Math.cos(dir)*force;
			this.ys += Math.sin(dir)*force;
		}

		if (this.xs>-10) {
			this.xs -= 0.5 + this.value*0.05;
		}

		this.updateSprite();
	}
});