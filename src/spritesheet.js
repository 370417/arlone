var Spritesheet =  {
    sw: 16,
    sh: 16,
    scale: 2
};

Spritesheet.load = function(e) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.mozImageSmoothingEnabled = false;
    ctx.oImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this, 0, 0, Spritesheet.sw, Spritesheet.sh, 0, 0, Spritesheet.sw * Spritesheet.scale, Spritesheet.sh * Spritesheet.scale);
    Spritesheet.canvas = canvas;
    Spritesheet.ctx = ctx;
};

var img = new Image(Spritesheet.sw, Spritesheet.sh);
img.addEventListener('load', Spritesheet.load, false);
img.src = 'res/hoplite.png';
