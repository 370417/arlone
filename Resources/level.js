var map = function(player, depth, prng, w, h) {
    var map = [];
    
    // fill the map with walls
    // outer edges are filled with outer walls
    for (var x = 0; x < w; x++) {
        map.push([]);
        for (var y = 0; y < h; y++) {
            if (x > 0 && x < w - 1 && y > 0 && y < h - 1) {
                map[x].push('wall');
            } else {
                map[x].push('outerWall');
            }
        }
    }
    
    // a list of rooms (rectangles)
    // initially there is one room covering the whole level (except the edges)
    var rooms = [{
        x: -5,
        y: -5,
        w: w + 10,
        h: h + 10
    }];
    
    // take a list of rooms, and recursively partition each one of them
    // if possible
    var partition = function(rooms) {
        var newRooms = [];
        var change = false;
        for (var i = 0; i < rooms.length; i++) {
            var room = rooms[i];
            // don't partition the room if it is too small
            if (room.w * room.h < 66) {
                newRooms.push(room);
                continue;
            }
            var dontStopEarly = true || rooms.length < 8 || prng.random() < 0.5;
            // Split the room horizontally
            if (room.w < room.h && room.h > 10 && dontStopEarly) {
                // Height of top room
                var h1 = 5 + 2 * Math.floor((room.h - 10) * prng.random() / 2);
                newRooms.push({
                    x: room.x,
                    y: room.y,
                    w: room.w,
                    h: h1
                });
                newRooms.push({
                    x: room.x,
                    y: room.y + h1 + 1,
                    w: room.w,
                    h: room.h - h1 - 1
                });
                change = true;
            // Split the room vertically
            } else if (room.w > 11 && dontStopEarly) {
                // Width of left room
                var w1 = 5 + 2 * Math.floor((room.w - 10) * prng.random() / 2);
                newRooms.push({
                    x: room.x,
                    y: room.y,
                    w: w1,
                    h: room.h
                });
                newRooms.push({
                    x: room.x + w1 + 1,
                    y: room.y,
                    w: room.w - w1 - 1,
                    h: room.h
                });
                change = true;
            } else {
                newRooms.push(room);
            }
        }
        if (change) {
            return partition(newRooms);
        } else {
            return newRooms;
        }
    };
    rooms = partition(rooms);
    
    // destroy rooms on the outer edge of the map
    // and
    // room.neighbors holds all the neighboring rooms and room.connected
    // holds all the connected rooms
    // rooms will need to know their index for the growing tree algorithm
    for (var i = rooms.length - 1; i > -1; i--) {
        if (rooms[i].x === -5 || rooms[i].y === -5 || rooms[i].x + rooms[i].w === w + 5 || rooms[i].y + rooms[i].h === h + 5) {
            rooms.splice(i, 1);
        } else {
            rooms[i].neighbors = [];
            rooms[i].connected = [];
            rooms[i].i = i;
        }
    }
    
    // specify the neighbors of each room
    for (var i = 0; i < rooms.length; i++) {
        // note that, because of the way we partitioned the rooms, the rooms
        // in the list are in left to right and top to bottom order
        for (var j = i + 1; j < rooms.length; j++) {
            var room1 = rooms[i];
            var room2 = rooms[j];
            var hNeighbors = room1.x + room1.w + 1 === room2.x   // must be horizontally adjacent
                            && room1.y < room2.y + room2.h       // room1 cannot be completely above room2
                            && room1.y + room1.h > room2.y;      // room1 cannot be completely below room2
            var vNeighbors = room1.y + room1.h + 1 === room2.y   // must be vertically adjacent
                            && room1.x < room2.x + room2.w       // room1 cannot be completely to the right of room2
                            && room1.x + room1.w > room2.x;      // room1 cannot be completely to the left of room2
            if (hNeighbors || vNeighbors) {
                room1.neighbors.push(room2);
                room2.neighbors.push(room1);
            }
        }
    }
    
    // number of visited rooms
    var roomsLength = 0;
    // size of each floodfill
    var counts = [0];
    var floodfill = function() {
        var count = 0;
        var fill = counts.length;
    
        // use a recursive backtracker to connect rooms
        // curr - current room
        // prev - previous room
        // fill - what to floodfill the rooms with
        // count - how many rooms have been processed
        var backtrack = function(curr, prev, fill) {
            count++;
            curr.fill = fill;
            if (prev) {
                curr.connected.push(prev);
                prev.connected.push(curr);
            }
            var neighbors = [];
            for (var i = 0; i < curr.neighbors.length; i++) {
                neighbors.splice(0, 0, curr.neighbors[i]);
            }
            for (var i = 0; i < neighbors.length; i++) {
                if (neighbors[i].connected.length === 0 && neighbors[i].neighbors.indexOf(curr) > -1) {
                    backtrack(neighbors[i], curr, fill);
                }
            }
        };
        
        // choose an unvisited room
        var room;
        do {
            room = rooms[Math.floor(rooms.length * prng.random())];
        } while (room.fill);
        
        backtrack(room, undefined, fill);
        roomsLength += count;
        counts[fill] = count;
        return roomsLength === rooms.length;
    };
    // floodfill all the rooms
    while (!floodfill());
    // NOTE THAT THIS BREAKS IF THERE ARE TWO GROUPS OF ROOMS THAT ARE TIED
    // AS BIGGEST
    // destroy rooms who are not part of the largest group of rooms
    for (var i = 0; i < rooms.length; i++) {
        if (counts[rooms[i].fill] !== Math.max.apply(null, counts)) {
            rooms.splice(i, 1);
        }
    }
    
    // connect random rooms to make loops
    for (var i = 0; i < rooms.length; i++) {
        for (var j = i + 1; j < rooms.length; j++) {
            if (rooms[i].neighbors.indexOf(rooms[j]) > -1 && rooms[i].connected.indexOf(rooms[j]) === -1 && prng.random() < 0.2) {
                rooms[i].connected.push(rooms[j]);
                rooms[j].connected.push(rooms[i]);
            }
        }
    }
    
    // add the rooms to the map
    for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        for (var x = room.x; x < room.x + room.w; x++) {
            for (var y = room.y; y < room.y + room.h; y++) {
                map[x][y] = 'floor';
            }
        }
    }
    
    // place the doors on the map
    for (var i = 0; i < rooms.length; i++) {
        for (var j = i + 1; j < rooms.length; j++) {
            var room1 = rooms[i];
            var room2 = rooms[j];
            if (room1.connected.indexOf(room2) > -1) {
                // if the rooms share a horizontal wall
                if (room1.y + room1.h + 1 === room2.y || room2.y + room2.h + 1 === room1.y) {
                    var minX = Math.max(room1.x, room2.x);
                    var maxX = Math.min(room1.x + room1.w, room2.x + room2.w);
                    var x = minX + Math.floor((maxX - minX) * prng.random());
                    var y = room2.y - 1;
                // otherwise the rooms share a vertical wall
                } else if (room1.x + room1.w + 1 === room2.x || room2.x + room2.w + 1 === room1.x) {
                    var minY = Math.max(room1.y, room2.y);
                    var maxY = Math.min(room1.y + room1.h, room2.y + room2.h);
                    var y = minY + Math.floor((maxY - minY) * prng.random());
                    var x = room2.x - 1;
                } else {
                    console.log('Oops!');
                }
                map[x][y] = prng.random() < 0.5 ? 'door' : 'openDoor';
            }
        }
    }
    
    // create monsters
    for (var i = 0; i < rooms.length; i++) {
        var monster = prng.random() < 0.5 ? newActor('coward') : newActor('duelist');
        this.monsters.push(monster);
        monster.x = rooms[i].x + Math.floor(rooms[i].w * prng.random());
        monster.y = rooms[i].y + Math.floor(rooms[i].h * prng.random());
        Schedule.add(monster, 0.1);
    }
    
    return map;
};

var fillArr = function(fill, w, h) {
    var arr = [];
    for (var x = 0; x < w; x++) {
        arr.push([]);
        for (var y = 0; y < h; y++) {
            arr[x].push(fill);
        }
    }
    return arr;
};

var Level = function(player, depth, seed) {
    this.w = Display.w;
    this.h = Display.h;
    this.prng = new MersenneTwister(seed);
    this.seen = fillArr(false, this.w, this.h);
    this.visible = fillArr(false, this.w, this.h);
    this.monsters = [];
    this.map = map.call(this, player, depth, this.prng, this.w, this.h);
};

// cy, cx - origin of fov
Level.prototype.fov = function(cx, cy, range) {
    // scans one row of one octant
    var scan = function(y, start, end, mx, my) {
        if (start >= end) {
            return;
        }
        var startX = Math.round(y * start);
        var endX = Math.round(y * end);
        var currX = mx(startX, y);
        var currY = my(startX, y);
        var prevX = currX;
        var prevY = currY;
        this.visible[currX][currY] = true;
        this.seen[currX][currY] = true;
        for (var x = startX + 1; x <= endX; x++) {
            currX = mx(x, y);
            currY = my(x, y);
            this.visible[currX][currY] = true;
            this.seen[currX][currY] = true;
            var currTransparent = Tiles[this.map[currX][currY]].transparent;
            var prevTransparent = Tiles[this.map[prevX][prevY]].transparent;
            if (currTransparent && !prevTransparent) {
                start = (x - 0.5) / (y - 0.5);
            } else if (!currTransparent && prevTransparent) {
                scan.call(this, y + 1, start, (x - 0.5) / (y + 0.5), mx, my);
            }
            prevX = currX;
            prevY = currY;
        }
        if (Tiles[this.map[mx(endX,y)][my(endX,y)]].transparent) {
            scan.call(this, y + 1, start, end, mx, my);
        }
    };
    scan.call(this, 1, 0, 1, function(x, y) {
        return cx + x;
    }, function(x, y) {
        return cy + y;
    });
    scan.call(this, 1, 0, 1, function(x, y) {
        return cx + x;
    }, function(x, y) {
        return cy - y;
    });
    scan.call(this, 1, 0, 1, function(x, y) {
        return cx - x;
    }, function(x, y) {
        return cy + y;
    });
    scan.call(this, 1, 0, 1, function(x, y) {
        return cx - x;
    }, function(x, y) {
        return cy - y;
    });
    scan.call(this, 1, 0, 1, function(x, y) {
        return cx + y;
    }, function(x, y) {
        return cy + x;
    });
    scan.call(this, 1, 0, 1, function(x, y) {
        return cx + y;
    }, function(x, y) {
        return cy - x;
    });
    scan.call(this, 1, 0, 1, function(x, y) {
        return cx - y;
    }, function(x, y) {
        return cy + x;
    });
    scan.call(this, 1, 0, 1, function(x, y) {
        return cx - y;
    }, function(x, y) {
        return cy - x;
    });
};

var distance = function(x1, y1, x2, y2) {
    var x = Math.abs(x1 - x2);
    var y = Math.abs(y1 - y2);
    return Math.max(x, y) + Math.min(x, y) / 2;
}

Level.prototype.draw = function(player) {
    var w = Display.w;
    var h = Display.h;
    
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            this.visible[x][y] = false;
        }
    }
    this.fov(player.x, player.y, 9e9);
    
    Display.ctx.clearRect(0, 0, w * Display.cw, h * Display.ch);
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            if (this.visible[x][y]) {
                var cell;
                var dist = distance(x, y, player.x, player.y);
                cell = Tiles[this.map[x][y]];
                for (var i = 0; i < this.monsters.length; i++) {
                    if (x === this.monsters[i].x && y === this.monsters[i].y) {
                        cell = Tiles[this.monsters[i].name];
                    }
                }
                Display.draw(x, y, cell.char, cell.fg);
            } else if (x === player.x && y === player.y) {
                var cell = Tiles[player.name];
                Display.draw(x, y, cell.char, cell.fg);
            } else if (this.seen[x][y]) {
                var cell = Tiles[this.map[x][y]];
                Display.draw(x, y, cell.char, [cell.fg[0] / 2, cell.fg[1] / 2, cell.fg[2] / 2]);
            }
        }
    }
};

var passable = function(x, y) {
    var tile = Tiles[game.level.map[x][y]];
    var passable = tile.passable;
    if (tile.char === '+') {
        passable = true;
    }
    for (var i = 0; i < game.level.monsters.length; i++) {
        var monster = game.level.monsters[i];
        if (monster !== this && x === monster.x && y === monster.y) {
            passable = false;
        }
    }
    if (x === game.player.x && y === game.player.y) {
        passable = false;
    }
    return passable;
};

var distance = function(dx, dy) {
    var D = Math.max(Math.abs(dx), Math.abs(dy));
    var d = Math.min(Math.abs(dx), Math.abs(dy));
    return D + Math.SQRT1_2 * d;
}