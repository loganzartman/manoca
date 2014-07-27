"use strict";

/**
 * Unfortunately, saved state has to be written to a file at some point.
 * The Profile class contains utilities for creating, modifying, loading, and saving Profiles.
 */
var Profile = {
	/**
	 * Generates a blank profile.
	 * @param props the properties to add
	 */
	create: function(props) {
		var prof = {
			"name": either(props.name, "Pilot"), //todo: resolve profiles with the same name
			"highscore": either(props.highscore, 0),
			"scrap": either(props.scrap, 0),
			"levelProgress": either(props.levelProgress, 0),
			"ships": either(props.ships, [1])
		};
		return prof;
	},

	/**
	 * Gets and returns profile called name from the game's data storage.
	 * @param name {String} the name of the profile
	 * @return {Object} the deserialized profile
	 */
	load: function(name) {
		var deserialized = JSON.parse(Game.dataStorage["profile_"+name]);
		return Profile.create(deserialized);
	},

	/**
	 * Writes out a profile to the game's data storage.
	 * @param profile {Object} the profile to save
	 */
	save: function(profile) {
		var serialized = JSON.stringify(profile);
		Game.dataStorage["profile_"+profile.name] = serialized;
	},

	/**
	 * Add a ship to a profile.
	 */
	addShip: function(profile, props) {
		profile.ships.push(props.id);
	},

	shipUnlocked: function(profile, ship) {
		return profile.ships.indexOf(ship.id)>=0;
	}
};