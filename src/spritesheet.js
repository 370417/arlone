var Spritesheet =  {
    sw: 360,
    sh: 360
};

Spritesheet.onload = function(e) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.mozImageSmoothingEnabled = false;
    ctx.oImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this, 0, 0);
    Spritesheet.canvas = canvas;
    Spritesheet.ctx = ctx;
};

Spritesheet.load = function(callback) {
    var img = new Image(Spritesheet.sw, Spritesheet.sh);
    img.addEventListener('load', Spritesheet.onload, false);
    img.src = 'res/spritesheet.png';
    callback.call();
};
