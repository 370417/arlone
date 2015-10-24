var input = {};

// this specifies what inputs the game will receive
// playing - waiting for the player to make their move
// attacking - waiting for the player to specify an attack
// animating - monsters, etc make their moves; the player can't move but can
//     access certain menus
input.mode = 'animating';

// this records what movement key is being pressed (for diagonal movement
// with arrow keys or WASD)
input.pressed = '';

// whether or not the current pressed key has been used to move
// diagonally or not
input.movedDiagonally = false;

// input.keyCode[e.keyCode] === e.key should be true
input.keyCode = {
    '37': 'ArrowLeft',
    '38': 'ArrowUp',
    '39': 'ArrowRight',
    '40': 'ArrowDown',
    '65': 'a',
    '66': 'b',
    '67': 'c',
    '68': 'd',
    '69': 'e',
    '70': 'f',
    '71': 'g',
    '72': 'h',
    '73': 'i',
    '74': 'j',
    '75': 'k',
    '76': 'l',
    '77': 'm',
    '78': 'n',
    '79': 'o',
    '80': 'p',
    '81': 'q',
    '82': 'r',
    '83': 's',
    '84': 't',
    '85': 'u',
    '86': 'v',
    '87': 'w',
    '88': 'x',
    '89': 'y',
    '90': 'z',
    '96': '0',
    '97': '1',
    '98': '2',
    '99': '3',
    '100': '4',
    '101': '5',
    '102': '6',
    '103': '7',
    '104': '8',
    '105': '9',
    '190': '.',
    '191': '/'
};

// Handles all of the keyDowns the player makes
input.keyDown = function(e) {try{
    var key = input.keyCode[e.keyCode] || e.key || 'Unknown';
    var player = window.game.player;

    /**
     * Call a callback based on what directional key the player pressed.
     * The callback must have arguments x and y that specify direction.
     */
    var directionalPressed = function(key, callback) {
        if (key === 'b' || key === '1') {
            callback.call(game.player, -1, 1);
        }
        else if (key === 'j' || key === '2') {
            callback.call(game.player, 0, 1);
        }
        else if (key === 'n' || key === '3') {
            callback.call(game.player, 1, 1);
        }
        else if (key === 'h' || key === '4') {
            callback.call(game.player, -1, 0);
        }
        else if (key === '.' || key === '5') {
            callback.call(game.player, 0, 0);
        }
        else if (key === 'l' || key === '6') {
            callback.call(game.player, 1, 0);
        }
        else if (key === 'y' || key === '7') {
            callback.call(game.player, -1, -1);
        }
        else if (key === 'k' || key === '8') {
            callback.call(game.player, 0, -1);
        }
        else if (key === 'u' || key === '9') {
            callback.call(game.player, 1, -1);
        }

        else if (key === 'Up' || key === 'ArrowUp' || key === 'w') {
            if (input.pressed === '') {
                input.pressed = 'up';
            } else if (input.pressed === 'left') {
                input.movedDiagonally = true;
                callback.call(game.player, -1, -1);
            } else if (input.pressed === 'right') {
                input.movedDiagonally = true;
                callback.call(game.player, 1, -1);
            } else if (input.pressed === 'down') {
                input.movedDiagonally = true;
            }
        }
        else if (key === 'Left' || key === 'ArrowLeft' || key === 'a') {
            if (input.pressed === '') {
                input.pressed = 'left';
            } else if (input.pressed === 'up') {
                input.movedDiagonally = true;
                callback.call(game.player, -1, -1);
            } else if (input.pressed === 'down') {
                input.movedDiagonally = true;
                callback.call(game.player, -1, 1);
            } else if (input.pressed === 'right') {
                input.movedDiagonally = true;
            }
        }
        else if (key === 'Down' || key === 'ArrowDown' || key === 's') {
            if (input.pressed === '') {
                input.pressed = 'down';
            } else if (input.pressed === 'left') {
                input.movedDiagonally = true;
                callback.call(game.player, -1, 1);
            } else if (input.pressed === 'right') {
                input.movedDiagonally = true;
                callback.call(game.player, 1, 1);
            } else if (input.pressed === 'up') {
                input.movedDiagonally = true;
            }
        }
        else if (key === 'Right' || key === 'ArrowRight' || key === 'd') {
            if (input.pressed === '') {
                input.pressed = 'right';
            } else if (input.pressed === 'up') {
                input.movedDiagonally = true;
                callback.call(game.player, 1, -1);
            } else if (input.pressed === 'down') {
                input.movedDiagonally = true;
                callback.call(game.player, 1, 1);
            } else if (input.pressed === 'left') {
                input.movedDiagonally = true;
            }
        }
    };

    if (input.mode === 'help') {
        document.getElementById('help').style.display = 'none';
        document.getElementById('Help-button').style.color = '';
        input.mode = 'playing';
    } else {
        if (key === '/' || key === '?') {
            document.getElementById('help').style.display = 'block';
            document.getElementById('Help-button').style.color = '#F00';
            document.getElementById('Z').style.color = '';
            input.mode = 'help';
        }
    }
    if (input.mode === 'playing') {
        directionalPressed(key, player.move);
        if (key === 'z') {
            document.getElementById('Z').style.color = '#F00';
            input.mode = 'attacking';
        }
    } else if (input.mode === 'attacking') {
        directionalPressed(key, player.attack);
        {
            document.getElementById('Z').style.color = '';
            input.mode = 'playing';
        }
    }
}catch(e){console.log(e)}};

input.keyUp = function(e) {
    var key = input.keyCode[e.keyCode] || e.key || 'Unknown';

    var player = window.game.player;

    if (input.mode === 'playing') {
        if (input.pressed === 'up' && (key === 'Up' || key === 'ArrowUp' || key === 'w')) {
            input.pressed = '';
            if (!input.movedDiagonally) {
                player.move([0, -1]);
            }
            input.movedDiagonally = false;
        }
        if (input.pressed === 'left' && (key === 'Left' || key === 'ArrowLeft' || key === 'a')) {
            input.pressed = '';
            if (!input.movedDiagonally) {
                player.move([-1, 0]);
            }
            input.movedDiagonally = false;
        }
        if (input.pressed === 'down' && (key === 'Down' || key === 'ArrowDown' || key === 's')) {
            input.pressed = '';
            if (!input.movedDiagonally) {
                player.move([0, 1]);
            }
            input.movedDiagonally = false;
        }
        if (input.pressed === 'right' && (key === 'Right' || key === 'ArrowRight' || key === 'd')) {
            input.pressed = '';
            if (!input.movedDiagonally) {
                player.move([1, 0]);
            }
            input.movedDiagonally = false;
        }
    } else if (input.mode === 'attacking') {
        if (input.pressed === 'up' && (key === 'Up' || key === 'ArrowUp' || key === 'w')) {
            input.pressed = '';
            if (!input.movedDiagonally) {
                player.attack([0, -1]);
            }
            input.movedDiagonally = false;
        }
        if (input.pressed === 'left' && (key === 'Left' || key === 'ArrowLeft' || key === 'a')) {
            input.pressed = '';
            if (!input.movedDiagonally) {
                player.attack([-1, 0]);
            }
            input.movedDiagonally = false;
        }
        if (input.pressed === 'down' && (key === 'Down' || key === 'ArrowDown' || key === 's')) {
            input.pressed = '';
            if (!input.movedDiagonally) {
                player.attack([0, 1]);
            }
            input.movedDiagonally = false;
        }
        if (input.pressed === 'right' && (key === 'Right' || key === 'ArrowRight' || key === 'd')) {
            input.pressed = '';
            if (!input.movedDiagonally) {
                player.attack([1, 0]);
            }
            input.movedDiagonally = false;
        }
    }
};

// click on Attack button
document.getElementById('Z').addEventListener('click', function() {
    if (input.mode === 'attacking') {
        document.getElementById('Z').style.color = '';
        input.mode = 'playing';
    } else if (!game.player.dead) {
        document.getElementById('X').style.color = '';
        document.getElementById('Help-button').style.color = '';
        document.getElementById('help').style.display = 'none';
        document.getElementById('Z').style.color = '#F00';
        input.mode = 'attacking';
    }
}, false);

// click on Help button
document.getElementById('Help-button').addEventListener('click', function() {
    if (input.mode === 'help') {
        document.getElementById('Help-button').style.color = '';
        document.getElementById('help').style.display = 'none';
        input.mode = 'playing';
    } else {
        document.getElementById('Z').style.color = '';
        document.getElementById('X').style.color = '';
        document.getElementById('Help-button').style.color = '#F00';
        document.getElementById('help').style.display = 'block';
        input.mode = 'help';
    }
}, false);

// click on ASCII button
document.getElementById('ascii-button').addEventListener('click', function() {
    document.getElementById('ascii-button').style.display = 'none';
    document.getElementById('tiles-button').style.display = 'inline-block';
    Display.useTiles = false;
    game.level.draw(game.player);
}, false);

// click on Tiles button
document.getElementById('tiles-button').addEventListener('click', function() {
    document.getElementById('tiles-button').style.display = 'none';
    document.getElementById('ascii-button').style.display = 'inline-block';
    Display.useTiles = true;
    game.level.draw(game.player);
}, false);
