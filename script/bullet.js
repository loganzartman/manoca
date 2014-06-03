"use strict";

var Bullet = Entity.extend(function(props){
	this.collisionMask = {
		width: 16,
		height: 16
	};
})
.methods({
	step: function() {
		this.supr();


		if (this.x<-this.sprite.width/2 || 
			this.y<-this.sprite.height/2 ||
			this.x>Graphics.width+this.sprite.width/2 ||
			this.y>Graphics.height+this.sprite.height/2) 
		{
			Game.entities.splice(Game.entities.indexOf(this),1);
			Graphics.stage.removeChild(this.sprite);
		}


		for (var i = Game.entities.length - 1; i >= 0; i--) {
			console.log("turn down");
			var e = Game.entities[i];
			if (!(e instanceof Bullet)) {
				if (this.collidesCircles(e)) {
					if (e.damagedBy(this)) {
						this.destroy();
					}
					break;
				}
			}
		}
	}
});