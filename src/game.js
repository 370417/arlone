var game;

var Game = function(seed) {
    var game = this;

    // predetermined or random seed for the prng
    this.seed = seed || Math.floor(9e9 * Math.random());

    // general prng
    this.prng = new MersenneTwister(this.seed);

    // seeds for each level
    this.levelSeeds = [];
    for (var i = 1; i < 6; i++) {
        this.levelSeeds[i] = this.seed + i;
    }

    // current depth
    this.depth = 1;

    // store the previously visited level
    this.oldLevel = undefined;

    // create the player
    this.player = newActor('player');
    this.player.delay = 1;
    Schedule.add(this.player, 0);

    // create the first level
    this.level = new Level(this.player, this.depth, this.depth + this.levelSeeds[1]);
    var level = this.level;

    // place the player
    this.player.x = 0;
    this.player.y = 0;
    while (this.level.map[this.player.x][this.player.y] !== 'floor') {
        this.player.x = 1 + Math.floor((Display.w - 2) * this.prng.random());
        this.player.y = 1 + Math.floor((Display.h - 2) * this.prng.random());
    }

    this.player.act = function() {
        if (this.doAttack()) {
            return;
        }
        if (this.doLunge()) {
            return;
        }
        level.draw(this);
        // check win condition
        if (!game.level.monsters.length) {
            Buffer.log('A winner is you!');
            return;
        }
        input.mode = 'playing';
    };

    Schedule.advance().act();
};

document.body.addEventListener('keydown', input.keyDown, false);
document.body.addEventListener('keyup', input.keyUp, false);

/**
 * Creates functions that increment a private variable when called.
 * This is used to start the game once all assets have been loaded.
 */
var loader = (function() {
    var assets = 0;
    var totalAssets = 2;
    return function(name) {
        assets++;
        if (assets == totalAssets) {
            try {
                game = new Game();
            } catch (e) {
                console.log(e);
            }
        }
    }
})();

// load the font
var font = new Font();

font.onload = loader;

Spritesheet.load(loader);

font.onerror = function(err) {
    alert('There was an error loading the font.');
    if (confirm('Start game with system font?')) {
        alert('Not yet implemented');
    }
};

font.fontFamily = 'DejaVu Sans';
font.src = font.fontFamily;
