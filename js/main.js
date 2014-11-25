var Rx;

(function () {
    'use strict';

    var canvasWrap = document.getElementsByClassName('fractal-view')[0];

    var fractalView = new FractalView(canvasWrap);

//    var imageData = context.createImageData(boundingBox.width, 1);

    var start = (new Date).getTime();
    //setTimeout(function () {
    //    renderLine(0);
    //}, 0);

    function renderLine(y) {
        while (y < boundingBox.height) {

            for (var x = 0; x < boundingBox.width; x++) {
                var pos = new Point(x, y);
                var coord = viewport.getCoord(pos);
                var n = calcDot(coord);

                var color = {r: 0, g: 0, b: 0};

                var c = 255 / 100 * n;
                color = {r: c, g: c, b: c};

                drawPixel(imageData, pos, color);

                //var index = pos.x * 4;
                //
                //imageData.data[index++] = color.r;
                //imageData.data[index++] = color.g;
                //imageData.data[index++] = color.b;
                //imageData.data[index] = 255;
                //

//            context.fillRect(pos.x, pos.y, 1, 1);
            }

            context.putImageData(imageData, 0, y);

            y++;
        }
        var now = (new Date).getTime();

        var elapsedMS = now - start;
        $('#totalTime').text(elapsedMS);

        //if (y == boundingBox.height - 1)
        //    return;
        //else
        //    setTimeout(function () {
        //        renderLine(y + 1);
        //    }, 0);

    }

    function mouseMove(e) {
        var pos = getMousePos(e);

        var coord = viewport.getCoord(pos);
        var c = mathjs.complex(coord.x, coord.y);

        var coord = viewport.getCoord(pos);
        var n = calcDot(coord);

        $('#mousepos').text(c + ", n = " + n);
    }

    function mouseDown(e) {
        var pos = getMousePos(e);

        var coord = viewport.getCoord(pos);
        var az = calcDot(coord);
//        var az2 = calcDot2(coord);

        console.log("C1: " + az);
        //      console.log( "C2: " + az2);
    }

    function getMousePos(e) {
        return new Point(
            e.clientX - boundingBox.left,
            e.clientY - boundingBox.top
        );
    }

    function calcDot(coord) {
        var cr = coord.x, ci = coord.y,
            zr = 0, zi = 0,
            tr = 0, ti = 0,
            az = 0;

        var n = 0;
        for (; n < 100 && az <= 4; n++) {
            tr = zr * zr - zi * zi + cr;
            ti = 2 * zr * zi + ci;

            zr = tr;
            zi = ti;
            az = zr * zr + zi * zi;
        }

        return n;
    }

    function drawPixel(image, pos, color) {
        var index = pos.x * 4;

        image.data[index++] = color.r;
        image.data[index++] = color.g;
        image.data[index++] = color.b;
        image.data[index] = 255;
    }
})();