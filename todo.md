To-do list
----------

**In progress**<br>
<s>Completed</s>

Queued:

1. Design+implement new set of levels and enemies
2. Implement level prerequisites
3. Pause screen
4. Control improvements
5. Reconsider ship pricing and design hardpoint configurations
6. Create hardpoint/inv UI
7. Create store UI
8. Finish all gameplay improvements
9. Implement online save
10. Create more weapons
11. Create more ships
12. Create more levels

* Gameplay
	* <s>Score</s> ✔
	* <s>Player death</s> ✔
	* Better damage feedback
		* Screen flash for player
		* Bright flashes for enemy hits
	* Better onscreen UI
		* Graphical health+shield
		* Transitions between menus?
	* Control improvement
		* Fix unrealistic acceleration with mouse control
		* Link engine to acceleration instead of velocity
		* Pause screen
* Weapons
	* Autoturrets
	* Missiles
	* <s>Moar laser</s> ✔
* <span style="background: yellow">Enemies</span>
	* Randomized (+color?)
	* **Higher tiers**
	* **Patterns/waves**
* Player
	* <s>Multiple base ships</s> ✔
	* Upgrades on per-ship basis
	* Purchasable weapons
	* Customizable weapon mounts
		* Classify weapons (light, med, heavy)
		* Define and classify hardpoints on each ship (...)
		* Build UI for displaying inventory and hardpoints
		* Build UI for displaying store
* Levels
	* **Randomly generated**
	* **Pre-defined enemy patterns**
	* Different backgrounds
* Online
	* Multiplayer is unlikely
	* Online login through OpenID Connect
		* Save game progress, etc.
		* Highscores? (too hackable?  vs. friends?)


Things that need to be determined
------
* Level progression
	* Pre-designed levels?
	* Semi-random levels?
		* Waves?
		* Continuous?
* Ship-owning mechanics
	* Unlockable? ✗
	* Purchasable? ✔
	* Pre-unlocked? ✗
* Upgrade mechanics
	* Purchased items?
		* Eg. buy better laser (ideal) <b>?</b>
	* Upgrade existing items?
		* Eg. buy laser upgrade IV (good) <b>?</b>
	* Upgrade ship
		* Eg. increase laser fire rate/damage/etc (fastest) ✗
	* <b>Note:</b>It may actually be easiest to make weapons entirely modular and mountable ✔
* Weapons
	* Missiles? (probably) ✔
		* Targeting mechanic? ✔
	* Other types of cannons/lasers?
	* Spec. weapons?
* Player
	* Instant-death? ✗
	* Shields?  ✔
	* Hull/shields? ✔
	* Lives? ✗
* Economy
	* Cash collected? ✔
	* Score -> cash? ✗
	* Etc.
* Game mechanics
	* Slide? (<a href="https://www.youtube.com/watch?v=azCnpbj9Wl4#t=206">this</a>) ✔ (implemented experimentally)
	* add more
