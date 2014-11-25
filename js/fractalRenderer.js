onmessage = function (e) {
    console.log("Work work! " + e.data);

    renderMandelbrot(e.data);
};

function renderMandelbrot(data) {
    var viewport = data.viewport;
    var width = viewport.clientRect.width,
        height = viewport.clientRect.height;
    console.log('width: ' + width + ", height: " + viewport.clientRect.height);

    var y = 0;
    while (y < height) {
        var imageData = new ImageData(width, 1);

        for (var x = 0; x < width; x++) {
            var pos = new Point(x, y);
            var coord = getCoord(viewport, pos);
            var n = calcDot(coord);

            var color = {r: 0, g: 0, b: 0};

            var c = 255 / 100 * n;
            color = {r: c, g: c, b: c};

            drawPixel(imageData.data, pos, color);
//            drawPixel(lineData, pos, color);
        }

        var message = {
            y: y,
            line: imageData
        };

        postMessage(message, [message.line.data.buffer]);

        y++;
    }
}


function drawPixel(image, pos, color) {
    var index = pos.x * 4;

    image[index++] = color.r;
    image[index++] = color.g;
    image[index++] = color.b;
    image[index] = 255;
}


function Point(x, y) {
    this.x = x;
    this.y = y;
}

function getCoord(vp, pos) {
    return new Point(
        (vp.scalex * pos.x) + vp.topLeft.x,
        (vp.scaley * pos.y) + vp.topLeft.y
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