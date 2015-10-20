/**
 * Handles drawing on the main canvas
 */

var Display = {
    // width in cells
    w: 49,
    // height in cells
    h: 29,
    // CSS font specifier
    font: '14px/16px "DejaVu Sans", monospace',
    // cell width
    cw: 16,
    // cell height
    ch: 16,
    // size of each pixel
    scale: 1
};

// Setup canvas & context
Display.canvas = document.createElement('canvas');
Display.canvas.width = Display.w * Display.scale * Display.cw;
Display.canvas.height = Display.h * Display.scale * Display.ch;
Display.ctx = Display.canvas.getContext('2d');
Display.ctx.font = Display.font;
Display.ctx.textAlign = 'center';
Display.ctx.mozImageSmoothingEnabled = false;
Display.ctx.oImageSmoothingEnabled = false;
Display.ctx.webkitImageSmoothingEnabled = false;
Display.ctx.imageSmoothingEnabled = false;
document.getElementById('game').insertBefore(Display.canvas, document.getElementById('bottom'));

// Give the game element a width so it can be centered
document.getElementById('game').style.width = (Display.w * Display.cw) + 'px';

// Setup the tooltip
Display.tooltip = document.createElement('div');
Display.tooltip.setAttribute('id', 'tooltip');
document.body.appendChild(Display.tooltip);
Display.toolx = -1;
Display.tooly = -1;

/**
 * Draw a single cell
 * @param {number} x x coordinate in cells
 * @param {number} y y coordinate in cells
 * @param {strung} char the character of the cell
 * @param {Array} fg the rgb color of the cell
 */
Display.draw = function(x, y, char, fg) {
    /** Turn the fg array into a string parseable by CSS */
    var arrToColor =  function(color) {
        return 'rgb(' + Math.floor(color[0]) + ',' + Math.floor(color[1]) + ',' + Math.floor(color[2]) + ')';
    };

    if (typeof char === 'string') {
        Display.ctx.fillStyle = arrToColor(fg);
        Display.ctx.fillText(char, (x + 0.5) * Display.scale * Display.cw, (y + 0.875) * Display.scale * Display.ch);
    }
};

Display.drawSprite = function(x, y, tile, hidden) {
    var sprite = Spritesheet.canvas;
    Display.ctx.drawImage(sprite, Display.cw * tile.x, Display.ch * tile.y, Display.cw, Display.ch, x * Display.scale * Display.cw, y * Display.scale * Display.ch, Display.scale * Display.cw, Display.scale * Display.ch);
    if (hidden) {
        Display.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        Display.ctx.fillRect(x * Display.scale * Display.cw, y * Display.scale * Display.ch, Display.scale * Display.cw, Display.scale * Display.ch);
    }
}

/** Minimize the tooltip */
Display.minimize = function() {
    Display.tooltip.innerHTML = '';
    Display.tooltip.style.height = '0';
    Display.tooltip.style.width = '116px';
    Display.tooltip.style.padding = '0';
};

/** Measures the height of the tooltip using an invisible clone of it */
Display.toolHeight = (function() {
    var invisible = document.createElement('div');
    invisible.style.position = 'absolute';
    invisible.style.left = '-100px';
    invisible.style.width = '100px';
    document.body.appendChild(invisible);
    return function(text) {
        invisible.innerHTML = text;
        return invisible.offsetHeight;
    };
})();

Display.canvas.addEventListener('mousemove', function(e) {
    var x = Math.floor((e.pageX - Display.canvas.parentElement.offsetLeft) / (Display.cw * Display.scale));
    var y = Math.floor((e.pageY - Display.canvas.offsetTop - Display.canvas.parentElement.offsetTop) / (Display.ch * Display.scale));
    if (x !== Display.toolx || y !== Display.tooly) {
        Display.toolx = x;
        Display.tooly = y;

        var initialHeight = Display.tooltip.offsetHeight;
        Display.tooltip.innerHTML = '';

        if (game.level.visible[x][y]) {
            //Display.tooltip.innerHTML = x + ', ' + y;

            for (var i = 0; i < game.level.monsters.length; i++) {
                var monster = game.level.monsters[i];
                if (x === monster.x && y === monster.y) {
                    Display.tooltip.innerHTML += Tiles[monster.name].desc + '<br>';
                }
            }

            var tile = game.level.map[x][y];
            Display.tooltip.innerHTML += tile;
        }

        Display.tooltip.style.width = '100px';
        Display.tooltip.style.height = Display.toolHeight(Display.tooltip.innerHTML) + 'px';
        Display.tooltip.style.padding = '8px';
        if (Display.tooltip.innerHTML.length === 0) {
            Display.minimize();
        }
    }
    Display.tooltip.style.left = (16 + e.pageX) + 'px';
    Display.tooltip.style.top = (16 + e.pageY) + 'px';
}, false)

Display.canvas.addEventListener('mouseout', function() {
    Display.minimize();
}, false);
