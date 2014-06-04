/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param child {DisplayObject} The DisplayObject to add to the container
 */
PIXI.DisplayObjectContainer.prototype.addChild = function(child)
{
    if (typeof child.depth !== "number") {child.depth = 0;}
	var i = this.findLocationFor(child);
    this.addChildAt(child, i, true);
};

/**
 * Gets the location that child should be added to in this DisplayObjectContainer's depth-sorted children array.
 * @return index to splice into
 */
PIXI.DisplayObjectContainer.prototype.findLocationFor = function(child) {
	for (var i=0; i<this.children.length; i++) {
		if (child.depth<=this.children[i].depth) {
			return i;
		}
	}
	return i;
}