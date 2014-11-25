
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Viewport(topLeft, bottomRight, clientRect) {
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;

    this.clientRect = {
        width: clientRect.width,
        height: clientRect.height
    };

    this.width = bottomRight.x - topLeft.x;
    this.height = bottomRight.y - topLeft.y;

    this.scalex = this.width / clientRect.width;
    this.scaley = this.height / clientRect.height;
}

Viewport.prototype.getCoord = function(pos) {
    return new Point(
        (this.scalex * pos.x) + this.topLeft.x,
        (this.scaley * pos.y) + this.topLeft.y
    );
}
