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
        y: 4
    },
    floor: {
        char: '\u00B7',
        passable: true,
        transparent: true,
        fg: [185, 185, 185],
        x: 1,
        y: 4
    },
    door: {
        char: '+',
        passable: false,
        transparent: false,
        fg: [222, 111, 55],
        x: 1,
        y: 0
    },
    openDoor: {
        char: '\u2212',
        passable: true,
        transparent: true,
        fg: [222, 111, 55],
        x: 3,
        y: 1
    },
    player: {
        char: '@',
        fg: [255, 255, 255],
        x: 0,
        y: 3
    },
    dragon: {
        char: 'D',
        fg: [200, 200, 255],
        x: 3,
        y: 0
    },
    rat: {
        char: 'R',
        fg: [255, 200, 200],
        x: 1,
        y: 2
    }
};
