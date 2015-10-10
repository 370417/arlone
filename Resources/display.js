var Display = {
    // width in cells
    w: 49,
    // height in cells
    h: 29,
    // CSS font specifier
    font: '14px/16px "DejaVu Sans", monospace',
    // cell width
    cw: 14,
    // cell height
    ch: 16
};

// Setup canvas & context
Display.canvas = document.createElement('canvas');
Display.canvas.width = Display.w * Display.cw;
Display.canvas.height = Display.h * Display.ch;
Display.ctx = Display.canvas.getContext('2d');
Display.ctx.font = Display.font;
Display.ctx.textAlign = 'center';
document.getElementById('game').insertBefore(Display.canvas, document.getElementById('bottom'));

// Give the game element a width so it can be centered
document.getElementById('game').style.width = (Display.w * Display.cw) + 'px';

// Draw a single cell
// x - x coordinate in cells
// y - y coordinate in cells
// char - character to be drawn (string or array)
// fg - foreground color of character (string or array)
// clear - clear the old cell before drawing the new one (default true)
Display.draw = function(x, y, char, fg) {
    var arrToColor =  function(color) {
        return 'rgb(' + Math.floor(color[0]) + ',' + Math.floor(color[1]) + ',' + Math.floor(color[2]) + ')';
    };
    
    //clear = clear || true;
    if (typeof char === 'string') {
        Display.ctx.fillStyle = arrToColor(fg);
        Display.ctx.fillText(char, (x + 0.5) * Display.cw, (y + 0.875) * Display.ch);
    }
};