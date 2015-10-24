/**
 * Stores information specific to tile types.
 *
 * {string} char - The character to display
 * {boolean} passable - whether or not the player can walk on the tile
 * {boolean} transparent - whether ot not the player can see through the tile
 * {Array} fg - the rgb foreground color of the tile
 * {number} x - the x coordinate of the sprite in the spritesheet
 * {number} y - the y coordinate of the sprite in the spritesheet
 */
var Tiles = {
    wall: {
        char: '#',
        passable: false,
        transparent: false,
        fg: [200, 200, 200],
        x: 0,
        y: 4,
        desc: 'The wall'
    },
    floor: {
        char: '\u00B7',
        passable: true,
        transparent: true,
        fg: [185, 185, 185],
        x: 1,
        y: 4,
        desc: 'The ground'
    },
    door: {
        char: '+',
        passable: false,
        transparent: false,
        fg: [222, 111, 55],
        x: 2,
        y: 4,
        desc: 'A closed door<br>You can open it by bumping into it.'
    },
    openDoor: {
        char: '\u2212',
        passable: true,
        transparent: true,
        fg: [222, 111, 55],
        x: 3,
        y: 4,
        desc: 'An open door<br>You can close it by walking through it.'
    },
    attack: {
        char: 'X',
        fg: [255, 0, 0],
        x: 1,
        y: 3
    },
    player: {
        char: '@',
        fg: [255, 255, 255],
        x: 0,
        y: 3,
        desc: 'You!'
    },
    dragon: {
        char: 'D',
        fg: [200, 200, 255],
        x: 3,
        y: 0,
        desc: '<div class="monster-desc">A dragon.<br>Dragons try to be two tiles away from you at all times. They will attack you if you are two tiles away from them.</div>'
    },
    rat: {
        char: 'R',
        fg: [255, 200, 200],
        x: 2,
        y: 2,
        desc: '<div class="monster-desc">A rat<br>Rats run away from you and attack you if cornered. When they are not alone, they charge at you and attack when in range.</div>'
    }
};
