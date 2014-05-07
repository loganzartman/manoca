"use strict";
var Input = {
	/**
	 * Enums representing player movement mode (keyboard or mouse)
	 */
	modes: {KEYBOARD: 0, MOUSE: 1},

	/**
	 * The currently selected movement mode (of Input.modes)
	 */
	movementMode: 1,

	/**
	 * A sparse array of booleans representing keypress state.
	 * Each index corresponds to a KeyEvent keycode.
	 */
	keys: [],

	/**
	 * Mouse X position
	 */
	mouseX: 0,

	/**
	 * Mouse Y position
	 */
	mouseY: 0,

	/**
	 * Boolean representing mouse left button pressed state
	 */
	mouseLeft: false,

	/**
	 * Boolean representing mouse right button pressed state
	 */
	mouseRight: false,

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
			Input.mouseX = event.pageX - Graphics.canvas.offsetLeft;
			Input.mouseY = event.pageY - Graphics.canvas.offsetTop;
		}, false);
		Graphics.canvas.addEventListener("mousedown", function(event) {
			event.preventDefault();
			if ((event.button || event.which) > 1) {
				Input.mouseRight = true;
			}
			else {
				Input.mouseLeft = true;
			}
		});
		Graphics.canvas.addEventListener("mouseup", function(event) {
			event.preventDefault();
			if ((event.button || event.which) > 1) {
				Input.mouseRight = false;
			}
			else {
				Input.mouseLeft = false;
			}
		});
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