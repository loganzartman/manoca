"use strict";

var Game = {
	player: null,
	entities: [],

	init: function() {
		Graphics.init();
		Starfield.init();
		Input.init();

		Game.player = new Player({
			"x": -128,
			"y": Graphics.height/2,
			"texture": Player.texture
		});
		Game.entities.push(Game.player);

		setInterval(function(){
			var r = new Random();
			var ufo = new Ufo({
				"x": Graphics.width+Ufo.texture.width/2,
				"y": r.next(Graphics.height),
				"xs": r.next(-2,-6),
				"ys": r.next(-1,1),
				"texture": Ufo.texture
			});
			Game.entities.push(ufo);
		},1000);

		Graphics.frame();
	},

	step: function() {
		for (var i = Game.entities.length - 1; i >= 0; i--) {
			var e = Game.entities[i];
			if (typeof e === "object") {
				e.step();
			}
		};
	}
};
window.addEventListener("load",Game.init,false);

var Input = {
	//A sparse array of booleans representing keypress state
	keys: [],

	//Mouse position data
	mouseX: 0,
	mouseY: 0,

	/**
	 * Keycode constants to be used with the Input.key() method.
	 * These can be either single numbers or arrays of numbers.
	 */
	VK_UP: [38,87],
	VK_DOWN: [40,83],
	VK_LEFT: [37,65],
	VK_RIGHT: [39,68],
	VK_SPACE: 32,

	/**
	 * Initializes input system.
	 * Mainly consists of adding event listeners.
	 * Should only be called once.
	 */
	init: function() {
		document.addEventListener("keydown", function(event){
			Input.keys[event.keyCode] = true;
		}, false);
		document.addEventListener("keyup", function(event){
			Input.keys[event.keyCode] = false;
		}, false);
		document.addEventListener("mousemove", function(event){
			Input.mouseX = event.pageX;
			Input.mouseY = event.pageY;
		}, false);
	},

	/**
	 * Checks to see if a key is pressed.
	 * @param codes A single number or an array of numbers representing keyCodes.
	 */
	key: function(codes) {
		if (typeof codes === "number") {
			return Input.keys[codes];
		}
		else if (codes instanceof Array) {
			for (var i=0; i<codes.length; i++) {
				if (Input.keys[codes[i]]) {
					return true;
				}
			}
			return false;
		}
	}
};

var Graphics = {
	//The HTML5 Canvas element used for output
	canvas: null,

	//The Pixi Stage which contains game objects
	stage: null,

	//The Pixi Renderer used to draw the stage
	renderer: null,

	//For dynamic bloom
	bloomTexture: null,
	bloomSprite: null,

	//Dimensions used for rendering
	width: 1200,
	height: 700,

	//Pixi Textures stored for re-use
	texture: {
		engineFire: PIXI.Texture.fromImage("img/fire10.png"),
		engineFireLight: PIXI.Texture.fromImage("img/fire10light.png")
	},

	/**
	 * Initialize Pixi and canvases.
	 * This method sizes and positions the canvas.
	 */
	init: function() {
		Graphics.canvas = document.getElementById("display");
		Graphics.canvas.width = Graphics.width;
		Graphics.canvas.height = Graphics.height;
		Graphics.canvas.style.marginLeft = ~~(-Graphics.width/2) + "px";
		Graphics.canvas.style.marginTop = ~~(-Graphics.height/2) + "px";
		Graphics.canvas.style.left = Graphics.canvas.style.top = "50%";

		Graphics.stage = new PIXI.Stage(0x000000);

		Graphics.renderer = PIXI.autoDetectRenderer(
			Graphics.width,
			Graphics.height,
			Graphics.canvas
		);

		//barely-noticeable bloom
		//fuck yeah!
		Graphics.bloomTexture = new PIXI.RenderTexture(Graphics.width, Graphics.height);
		Graphics.bloomSprite = new PIXI.Sprite(Graphics.bloomTexture);
		Graphics.bloomSprite.blendMode = PIXI.blendModes.ADD;
		var bloomBlur = new PIXI.BlurFilter();
		bloomBlur.blurX = bloomBlur.blurY = 16;
		Graphics.bloomSprite.filters = [bloomBlur];
		Graphics.bloomSprite.depth = 1;
		Graphics.bloomSprite.alpha = 0.9;
		Graphics.stage.addChild(Graphics.bloomSprite);

		window.addEventListener("resize", Graphics.resize, false);
	},

	/**
	 * Render a frame.
	 * This method should only be called once, in Game.init.
	 * Subsequent calls are made by requestAnimationFrame()
	 */
	frame: function() {
		Game.step();
		Starfield.frame();

		Graphics.stage.children.sort(function(a,b){
			if (!a.depth) {a.depth = 0;}
			if (!b.depth) {b.depth = 0;}
			return a.depth<b.depth ? -1 : a.depth>b.depth ? 1 : 0;
		});

		Graphics.bloomTexture.render(Graphics.stage);
		Graphics.renderer.render(Graphics.stage);

		requestAnimationFrame(Graphics.frame);
	},

	resize: function(event) {
		/*Graphics.width = window.innerWidth;
		Graphics.height = window.innerHeight;
		Graphics.renderer.view.width = Graphics.width;
		Graphics.renderer.view.height = Graphics.height;*/
	},

	getBounds: function() {
		return {
			"x1": 0,
			"y1": 0,
			"x2": Graphics.width,
			"y2": Graphics.height
		};
	},

	addEngineFire: function(ship, textureName) {
		ship.engineFire = {
			sprite: new PIXI.Sprite(Graphics.texture[textureName]),
			light: new PIXI.Sprite(Graphics.texture[textureName+"Light"]),
			scale: 1,
			updateSprite: function() {
				var rv = new Random().next(0.8,1.1);
				ship.engineFire.sprite.scale = new PIXI.Point(1,ship.engineFire.scale*rv);
				ship.engineFire.light.scale = new PIXI.Point(ship.engineFire.scale*rv,ship.engineFire.scale*rv);
			}
		};

		ship.engineFire.sprite.anchor = new PIXI.Point(0.5,0);
		ship.engineFire.sprite.position = new PIXI.Point(0,ship.sprite.height/2);
		ship.engineFire.sprite.blendMode = PIXI.blendModes.ADD;

		ship.engineFire.light.anchor = new PIXI.Point(0.5,0.2);
		ship.engineFire.light.position = new PIXI.Point(0,ship.sprite.height/2);
		ship.engineFire.light.alpha = 0.5;
		ship.engineFire.light.blendMode = PIXI.blendModes.ADD;

		ship.sprite.addChild(ship.engineFire.sprite);
		ship.sprite.addChild(ship.engineFire.light);
	}
};

var Starfield = {
	g: null,
	stars: [],
	nebulae: [],
	nebula: null,
	speed: 1,

	init: function() {
		Starfield.g = new PIXI.Graphics();
		Graphics.stage.addChild(Starfield.g);
		
		for (var i=0; i<1; i++) {
			Starfield.nebulae.push(PIXI.Texture.fromImage("img/nebula"+i+".png"));
		}
		Starfield.nebula = new PIXI.Sprite(Starfield.nebulae[0]);
		Starfield.nebula.position = new PIXI.Point(0,0);
		Starfield.nebula.depth = 0;
		Graphics.stage.addChildAt(Starfield.nebula,0);

		var rand = new Random();
		var nstars = (Graphics.width*Graphics.height)/5000;
		for (var i=0; i<nstars; i++) {
			Starfield.stars.push({
				"x": ~~rand.next(0,Graphics.width),
				"y": ~~rand.next(0,Graphics.height),
				"xs": rand.next(0,-20),
				"ys": 0,
				"a": rand.next(0,0.5)
			});
		}
	},

	frame: function() {
		Starfield.g.clear();
		
		for (var i = Starfield.stars.length - 1; i >= 0; i--) {
			var s = Starfield.stars[i];
			s.x += s.xs*Starfield.speed;
			s.y += s.ys*Starfield.speed;
			if (s.x < 0-s.xs) {
				s.x = Graphics.width+s.x;
			}
			Starfield.g.beginFill(0xFFFFFF);
			Starfield.g.fillAlpha = s.a;
			Starfield.g.drawRect(s.x,s.y,s.xs,1);
			Starfield.g.endFill();
		};
	}
};

var Time = {
	sec: function(s) {
		return s*1000;
	},

	min: function(s) {
		return Time.sec(s)*60;
	},

	now: function() {
		return Date.now();
	}
};

function Random(seed) {
	this.seed = seed || Date.now();
}
Random.prototype.next = function(min,max) {
	if (typeof min === "number") {
    	if (typeof max !== "number") {
    		max = min;
    		min = 0;
    	}
	}
	else {
		min = 0;
		max = 1;
	}

	var x = Math.sin(this.seed++) * 10000;
    return (x - Math.floor(x))*(max-min)+min;
};
function sign(x) {
    return typeof x === "number" ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

/**
 * Simple base class for all entities
 */
var Entity = klass(function(props){
	this.x = props.x||0;
	this.y = props.y||0;
	this.xs = props.xs||0;
	this.ys = props.ys||0;
	this.sprite = props.texture ? new PIXI.Sprite(props.texture) : {};
	this.sprite.anchor = new PIXI.Point(0.5,0.5);
	this.angle = 0;
})
.methods({
	updateSprite: function() {
		this.sprite.position = new PIXI.Point(
			this.x,
			this.y
		);
		this.sprite.rotation = this.angle;
	},
	step: function() {
		this.x += this.xs;
		this.y += this.ys;
	},
	inBounds: function(bounds) {
		return (this.x>=bounds.x1-this.sprite.width/2 || typeof bounds.x1 === "undefined") &&
		       (this.y>=bounds.y1-this.sprite.height/2 || typeof bounds.y1 === "undefined") &&
		       (this.x<=bounds.x2+this.sprite.width/2 || typeof bounds.x2 === "undefined") &&
		       (this.y<=bounds.y2+this.sprite.height/2 || typeof bounds.y2 === "undefined");
	},
	distanceTo: function(ent) {
		if (typeof ent.x !== "undefined" && typeof ent.y !== "undefined") {
			var dx = ent.x-this.x,
			    dy = ent.y-this.y;
			var dist = Math.sqrt(dx*dx+dy*dy);
			return dist;
		}
		else {
			throw new Error("distanceTo error: Object must have x/y coords!");
		}
	},
	collidesCircles: function(ent) {
		var dist = this.distanceTo(ent);
		if (typeof ent.sprite !== "undefined") {
			return dist < this.sprite.width/2 + ent.sprite.width/2;
		}
		else {
			throw new Error("collidesCircles error: Object must have a sprite!");
		}
	},
	destroy: function() {
		Game.entities.splice(Game.entities.indexOf(this),1);
		Graphics.stage.removeChild(this.sprite);
	}
});

/**
 * The player class.
 * @param props props
 */
var Player = Entity.extend(function(props){
	this.leftGun = new GunMount(this, new PIXI.Point(0.5,0.1));
	this.rightGun = new GunMount(this, new PIXI.Point(0.5,0.9));
	this.guns = new GunCycler([this.leftGun, this.rightGun], BasicLaser.delay/2);

	this.sprite.depth = 1000;

	Graphics.addEngineFire(this, "engineFire");
	Graphics.stage.addChild(this.sprite);
})
.statics({
	texture: PIXI.Texture.fromImage("img/playerShip2_red.png"),
	accel: 3,
	top: 20,
	friction: 8/7
})
.methods({
	updateSprite: function() {
		this.supr();
		this.engineFire.updateSprite();
	},
	step: function() {
		this.supr();
		
		//movement
		if (Input.key(Input.VK_UP)) {
			this.ys-=Player.accel;
		}
		else if (Input.key(Input.VK_DOWN)) {
			this.ys+=Player.accel;
		}
		if (Input.key(Input.VK_LEFT)) {
			this.xs-=Player.accel;
			this.engineFire.scale = 0.7;
		}
		else if (Input.key(Input.VK_RIGHT)) {
			this.xs+=Player.accel;
			this.engineFire.scale = 1.5;
		}
		else {
			this.engineFire.scale = 1;
		}

		//speed limiter
		if (Math.abs(this.ys)>Player.top) {
			this.ys = sign(this.ys)*Player.top;
		}
		if (Math.abs(this.xs)>Player.top) {
			this.xs = sign(this.xs)*Player.top;
		}

		//soft boundaries
		if (this.x>Graphics.width/2) {
			this.x -= (this.x-Graphics.width/2)/10;
		}
		else if (this.x<this.sprite.width) {
			this.x += (this.sprite.width-this.x)/5;
		}
		if (this.y>Graphics.height-this.sprite.height) {
			this.y -= (this.y-(Graphics.height-this.sprite.height))/5;
		}
		else if (this.y<this.sprite.height) {
			this.y += (this.sprite.height-this.y)/5;
		}

		//friction
		this.xs /= Player.friction;
		this.ys /= Player.friction;

		this.angle = Math.PI/2+(this.ys/Player.top)*Math.PI/7;

		//guns
		if (Input.key(Input.VK_SPACE)) {
			this.guns.fire(BasicLaser);
		}

		this.updateSprite();
	},
	kill: function() {

	}
});

var Hostile = Entity.extend(function(props){

})
.methods({
	step: function() {
		this.supr();
		if (!this.inBounds({"x1": 0})) {
			this.destroy();
		}
	},

	kill: function() {
		this.destroy();
	}
});

var Ufo = Hostile.extend(function(props){
	this.sprite.depth = 1000;
	Graphics.stage.addChild(this.sprite);
})
.statics({
	texture: PIXI.Texture.fromImage("img/ufoGreen.png"),
})
.methods({
	updateSprite: function() {
		this.supr();
	},
	step: function() {
		this.supr();

		if (this.collidesCircles(Game.player)) {
			this.kill();
			Game.player.kill();
		}

		for (var i = Game.entities.length - 1; i >= 0; i--) {
			var e = Game.entities[i];
			if (e instanceof Bullet) {
				if (this.collidesCircles(e)) {
					e.destroy();
					this.kill();
					break;
				}
			}
		}

		this.updateSprite();
	}
});

var GunMount = klass(function(ship,anchorPoint){
	this.ship = ship;
	this.anchorPoint = anchorPoint;
	this.lastFire = Date.now();
})
.methods({
	fire: function(LaserType){
		if (Date.now()-this.lastFire >= LaserType.delay) {
			var rnd = new Random();
			var rc = LaserType.recoil*(Math.PI/180);

			var xs = Math.sin(this.ship.angle+rnd.next(-rc,rc))*LaserType.speed,
				ys = -Math.cos(this.ship.angle+rnd.next(-rc,rc))*LaserType.speed;

			var laser = new LaserType({
				"x": this.ship.x + (this.anchorPoint.x-this.ship.sprite.anchor.x)*this.ship.sprite.width,
				"y": this.ship.y + (this.anchorPoint.y-this.ship.sprite.anchor.y)*this.ship.sprite.height,
				"xs": xs,
				"ys": ys,
				"texture": LaserType.texture
			});

			Game.entities.push(laser);

			this.lastFire = Date.now();
			return true;
		}
		return false;
	}
});

var GunCycler = klass(function(gunMounts, delay){
	this.gunMounts = gunMounts;
	this.delay = delay;
	this.lastFire = Date.now();
	this.ind = 0;
})
.methods({
	fire: function(LaserType) {
		if (Date.now() - this.lastFire >= this.delay) {
			if (this.gunMounts[this.ind].fire(LaserType)) {
				this.ind = (this.ind+1)%this.gunMounts.length;
				this.lastFire = Date.now();
			}
		}
	}
});

var Bullet = Entity.extend(function(props){

});

var BasicLaser = Bullet.extend(function(props){
	this.sprite.scale = new PIXI.Point(1,2);
	this.sprite.blendMode = PIXI.blendModes.ADD;
	this.sprite.depth = 50;
	this.angle = Math.atan2(this.xs,-this.ys);
	this.updateSprite();
	Graphics.stage.addChild(this.sprite);
})
.statics({
	texture: PIXI.Texture.fromImage("img/laserRed01.png"),
	delay: Time.sec(0.2),
	speed: 40,
	recoil: 1
})
.methods({
	updateSprite: function() {
		this.sprite.position = new PIXI.Point(
			this.x,
			this.y
		);
		this.sprite.rotation = this.angle;
	},

	step: function() {
		this.x += this.xs;
		this.y += this.ys;

		if (this.x<-this.sprite.width/2 || 
			this.y<-this.sprite.height/2 ||
			this.x>Graphics.width+this.sprite.width/2 ||
			this.y>Graphics.height+this.sprite.height/2) 
		{
			Game.entities.splice(Game.entities.indexOf(this),1);
			Graphics.stage.removeChild(this.sprite);
		}

		this.angle = Math.atan2(this.xs,-this.ys);
		
		this.updateSprite();
	}
});
