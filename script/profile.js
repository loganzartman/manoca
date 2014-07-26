"use strict";

var Profile = {
	create: function(props) {
		return {
			"name": either(props.name, "Pilot"), //todo: resolve profiles with the same name
			"highscore": 0,
			"scrap": 0,
			"levelProgress": 0,
			"ships": []
		};
	},

	/**
	 * Add a ship to a profile.
	 */
	addShip: function(profile, props) {
		profile.ships.push(props.index);
	},

	load: function() {
		//this may be necessary at some point to perform network saves
	},

	save: function() {
		//this may be necessary at some point to perform network saves
	}
};