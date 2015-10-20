var Spritesheet =  {
    sw: 360,
    sh: 360
};

Spritesheet.onload = function(callback) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this, 0, 0);
    Spritesheet.canvas = canvas;
    Spritesheet.ctx = ctx;
};

Spritesheet.load = function(callback) {
    var img = new Image(Spritesheet.sw, Spritesheet.sh);
    img.addEventListener('load', function(e) {
        Spritesheet.onload.call(img);
        callback.call();
    }, false);
    img.src = 'res/spritesheet.png';
};
