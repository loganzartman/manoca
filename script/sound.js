"use strict";

var Sound = {
	_volumeMaster: 1.0,
	_igsPlaying: false,
	sounds: [],

	set volume(val) {
		Sound._volumeMaster = Math.min(Math.max(0,val),1);
	},
	get volume() {
		return Sound._volumeMaster;
	},

	/**
	 * Initialize the bangin' soundsystem.
	 */
	init: function() {
		Sound.queue("snd/click.wav", "click");
		Sound.queue("snd/hover.wav", "hover");
		Sound.queue("snd/explode.wav", "explode0");
		Sound.queue("snd/explode2.wav", "explode1");
		Sound.queue("snd/explode3.wav", "explode2");
		Sound.queue("snd/explode4.wav", "explode3");
		Sound.queue("snd/laser.wav", "laser");
		Sound.queue("snd/laser_small.wav", "laser_small");
		Sound.queue("snd/laser_big.wav", "laser_big");
		Sound.queue("snd/cannon.wav", "cannon");
		Sound.queue("snd/coin.wav", "coin");
		Sound.queue("snd/test.wav", "test");

		Sound.queue("snd/engine.wav", "engine", {"loop": true});
		Sound.queue("snd/engineh.wav", "engineh", {"loop": true});
		Sound.queue("snd/hyperdrive_start.wav", "hyperdrive_start");
		Sound.queue("snd/hyperdrive_fire.wav", "hyperdrive_fire");

		Sound.queue("snd/voice/igs0.wav", "igs0");
		Sound.queue("snd/voice/igs1.wav", "igs1");
		Sound.queue("snd/voice/igs2.wav", "igs2");
		Sound.queue("snd/voice/highscore.wav", "highscore");
		Sound.queue("snd/voice/success.wav", "success");
		Sound.queue("snd/voice/destroyed.wav", "destroyed");
	},

	/**
	 * Load a new sound (asynchronous)
	 * @param src {String} file path to sound
	 * @param name {String} what to identify the sound as
	 */
	queue: function(src, name, props) {
		var snd = new Howl(Util.collect({
			urls: [src],
			autoplay: false
		}, props));
		Sound.sounds[name] = snd;
	},

	/**
	 * Play a sound
	 * @param name {String} the name of the sound (as specified in queue method)
	 * @param volume {Number} optional volume that will be applied in addition to master volume
	 * @return {Object} the sound instance
	 */
	play: function(name, volume) {
		var inst = Sound.sounds[name];
		if (inst) {
			if (typeof volume !== "undefined") volume = Math.min(Math.max(0,volume),1);
			else volume = 1.0;
			inst.volume(Sound.volume*volume);
			inst.play();
			return inst;
		}
	},

	stop: function(name) {
		var inst = Sound.sounds[name];
		if (inst) {
			inst.stop();
		}
	},

	playIgs: function() {
		if (!Sound._igsPlaying) {
			var snd = Sound.play("igs"+(~~Random.next(3)));
			Sound._igsPlaying = true;
			snd.on("end", function() {
				Sound._igsPlaying = false;
			});
		}
	}
}