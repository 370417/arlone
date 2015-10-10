/**
 * Stores information specific to tile types.
 *
 * {string} char The character to display
 * {boolean} passable whether or not the player can walk on the tile
 * {boolean} transparent whether ot not the player can see through the tile
 * {Array} fg the rgb foreground color of the tile
 */
var Tiles = {
    wall: {
        char: '#',
        passable: false,
        transparent: false,
        fg: [200, 200, 200]
    },
    outerWall: {
        char: '#',
        passable: false,
        transparent: false,
        fg: [200, 200, 200]
    },
    floor: {
        char: '\u00B7',
        passable: true,
        transparent: true,
        fg: [185, 185, 185]
    },
    door: {
        char: '+',
        passable: false,
        transparent: false,
        fg: [222, 111, 55]
    },
    openDoor: {
        char: '\u2212',
        passable: true,
        transparent: true,
        fg: [222, 111, 55]
    },
    player: {
        char: '@',
        fg: [255, 255, 255]
    },
    dragon: {
        char: 'D',
        fg: [200, 200, 255]
    },
    rat: {
        char: 'r',
        fg: [255, 200, 200]
    }
};
