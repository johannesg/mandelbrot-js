function FractalView(element) {
    this.canvasWrap = element;
    this.canvas = element.getElementsByClassName('canvas')[0];
    this.zoomBox = element.getElementsByClassName('zoom-box')[0];

    var context = this.canvas.getContext('2d');
    var boundingBox = this.canvas.getBoundingClientRect();

    var topLeft = new Point(-2, 1);
    var bottomRight = new Point(1, -1);

    var viewport = new Viewport(topLeft, bottomRight, boundingBox);

    var self = this;

    setupMousedrag();

    var worker = new Worker('js/fractalRenderer.js');

    worker.postMessage({
        width: boundingBox.width,
        height: boundingBox.height,
        viewport: viewport
    });

    worker.onmessage = function (message) {
        context.putImageData(message.data.line, 0, message.data.y);
    };

    function setupMousedrag() {
        var mousedown = Rx.DOM.mousedown(self.canvasWrap);
        var mousemove = Rx.DOM.mousemove(self.canvasWrap);
        var mouseup = Rx.DOM.mouseup(document);

        mousedown
            .flatMap(function (e) {
                var startX = e.clientX;
                var startY = e.clientY;
                self.zoomBox.style.display = "inherit";

                return mousemove
                    .map(function (e) {
                        return {
                            startX: startX - boundingBox.left,
                            startY: startY - boundingBox.top,
                            endX: e.clientX - startX,
                            endY: e.clientY - startY
                        };
                    })
                    .takeUntil(mouseup)
                    .doOnCompleted(function () {
                        self.zoomBox.style.display = "none";
                    });
            })
            .subscribe(function (e) {
                console.log("Drag: X: " + e.startX + ", Y: " + e.startY + ", EX: " + e.endX + ", EY: " + e.endY);
                self.zoomBox.style.left = e.startX + "px";
                self.zoomBox.style.top = e.startY + "px";
                self.zoomBox.style.width = e.endX + "px";
                self.zoomBox.style.height = e.endY + "px";
            });

        //Rx.DOM.mousemove(this.canvas)
        //    .subscribe(mouseMove);
    }
}
