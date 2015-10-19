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

Display.drawSprite = function(x, y, tile) {
    var sprite = Spritesheet.canvas;
    Display.ctx.drawImage(sprite, Display.cw * tile.x, Display.ch * tile.y, Display.cw, Display.ch, x * Display.scale * Display.cw, y * Display.scale * Display.ch, Display.scale * Display.cw, Display.scale * Display.ch);
}
