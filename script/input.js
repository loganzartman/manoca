"use strict";
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