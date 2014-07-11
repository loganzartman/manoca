"use strict";

/**
 * Warning: this class uses lots of voodoo magic
 */
var ParticleSystem = klass(function(props){
	this.container = either(props.container, Graphics.stage);
	this.batches = {};

	this.count = 0; //total number of particles
	this.size = either(props.size, 10000); //place a hard limit on size
	this._index = 0; //where to insert next particle
	this.particles = [];
	for (var i=0; i<this.size; i++) {this.particles[i]=null;} //I don't like leaving undefineds in it
})
.methods({
	/**
	 * Creates a particle in this system.
	 * Supported properties are:
	 * - type: particle type
	 * @param props properties
	 */
	emit: function(props) {
		var type = either(props.type, "default");
		var part = new window[type](Util.collect(props, {
			"system": this
		}));

		this._index = (this._index+1)%this.size;
		if (this.particles[this._index]!==null) {
			this.destroy(this.particles[this._index]);
		}
		this.particles[this._index] = part;

		if (!this.batches[type]) {
			//tintable particles cannot be batched
			if (window[type].tintable) this.batches[type] = new PIXI.DisplayObjectContainer();
			else this.batches[type] = new PIXI.SpriteBatch();

			this.batches[type].blendMode = part.blendMode;
			this.container.addChild(this.batches[type]);
		}
		this.batches[type].addChild(part.sprite);
		this.count++;
	},

	step: function() {
		for (var i = this.size - 1; i >= 0; i--) {
			if (this.particles[i] !== null) {
				this.particles[i].step();
			}
		};
	},

	/**
	 * Destroys a particle.
	 * @param part an object reference to destroy
	 */
	destroy: function(part) {
		var type = either(part.type, "default");
		var ind = this.particles.indexOf(part);
		var cin = this.batches[type]?this.batches[type].children.indexOf(part.sprite):-1;

		if (ind >= 0 && cin >= 0) {
			this.count--;
			this.particles[ind] = null;
			this.batches[type].removeChild(part.sprite);
		}
	}
});