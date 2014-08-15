"use strict";

var stage,renderer;
var texShip, texNMap;
var ship;
var filter;
var DEPTH = 0.075;

function load() {
	stage = new PIXI.Stage(0x000000);
	renderer = PIXI.autoDetectRenderer(500, 500);
	document.body.appendChild(renderer.view);

	//load textures
	texShip = PIXI.Texture.fromImage("F5S4.png");
	texNMap = PIXI.Texture.fromImage("F5S4N.png");


	//make sprite
	ship = new PIXI.Sprite(texShip);
	ship.anchor = new PIXI.Point(0.5,0.5);
	ship.position = new PIXI.Point(renderer.width/2, renderer.height/2);
	stage.addChild(ship);

	renderer.view.addEventListener("mousemove", function(event){
		filter.LightPos = {
			x: event.layerX/renderer.width,
			y: 1.0-event.layerY/renderer.height,
			z: DEPTH
		}
	}, false);

	//add filter
	setTimeout(addFilter,100);

	requestAnimFrame( animate );
}

function addFilter() {
	texNMap._powerOf2 = true;
	filter = new PIXI.NormalMapFilter(texNMap);
	filter.LightPos = {x:0.2, y:0.2, z:0.5};
	ship.filters = [filter];
}

function animate() {
    requestAnimFrame( animate );
    
    
    // render the stage   
    renderer.render(stage);
}