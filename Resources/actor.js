var Actor = {
    name: '',
    delay: 1, // How much time passes after a move
    dead: false,
    attackDirection: [0, 0], // A planned attack's position relative to the attacker
    attackTarget: undefined, // A planned attack's initial target
    attackType: 'feint',
    state: 'asleep',
    lastSeenTarget: [null, null] // Where a monster last saw what it is chasing
};

Actor.attack = function(direction) {
    if (this.name === 'player') {
        // The next line really should go in input.js
        document.getElementById('Z').removeAttribute('style');
        input.mode = 'animating';
    }
    this.attackType = 'feint';
    if (this.name === 'player') {
        this.attackType = 'playerfeint';
    }
    this.attackDirection = direction;
    var targetX = this.x + this.attackDirection[0];
    var targetY = this.y + this.attackDirection[1];
    for (var i = 0; i < game.level.monsters.length; i++) {
        var monster = game.level.monsters[i];
        if (monster.attackDirection[0] || monster.attackDirection[1]) {
            
        }
        if (targetX === monster.x && targetY === monster.y) {
            this.attackType = 'dodge';
            if (this.name === 'player') {
                this.attackType = 'dodgeplayer';
            }
            this.attackTarget = monster;
        }
        if (targetX === game.player.x && targetY === game.player.y) {
            this.attackType = 'playerdodge';
            this.attackTarget = game.player;
        }
    }
    
    Schedule.add(this, this.delay);
    Schedule.advance().act();
}

Actor.move = function(direction) {
    if (this.name === 'player') {
        input.mode = 'animating';
    }

    if (direction[0] === 0 && direction[1] === 0) {
        Schedule.add(this, this.delay);
        Schedule.advance().act();
        return;
    }

    var destination = {
        x: this.x + direction[0],
        y: this.y + direction[1]
    };
    destination.name = window.game.level.map[destination.x][destination.y];
    destination.info = Tiles[destination.name];
    
    // check if there's a monster in the way
    for (var i = 0; i < game.level.monsters.length; i++) {
        var monster = window.game.level.monsters[i];
        if (destination.x === monster.x && destination.y === monster.y && !monster.dead) {
            if (this.name === 'player') {
                Buffer.log('You bump the ' + monster.name + '. Nothing happens.');
            }
            Schedule.add(this, this.delay);
            Schedule.advance().act();
            return;
        }
    }
    
    // check if the player is in the way
    if (this.name !== 'player') {
        var player = game.player;
        if (destination.x === player.x && destination.y === player.y) {
            Buffer.log('The ' + this.name + ' bumps you. Nothing happens.');
            Schedule.add(this, this.delay);
            Schedule.advance().act();
            return;
        }
    }

    if (destination.info.passable) {
            if (game.level.map[this.x][this.y] === 'openDoor') {
                game.level.map[this.x][this.y] = 'door';
            }
            this.x = destination.x;
            this.y = destination.y;
            if (this.name === 'player') {
                game.level.fov(this.x, this.y, 9e9);
            }
            Schedule.add(this, this.delay);
            Schedule.advance().act();
    } else if (destination.name === 'door') {
        window.game.level.map[destination.x][destination.y] = 'openDoor';
        if (this.name === 'player') {
            game.level.fov(this.x, this.y, 9e9);
        }
        Schedule.add(this, this.delay);
        Schedule.advance().act();
    } else if (destination.name === 'wall') {
        if (this.name === 'player') {
            Buffer.log('There is a wall there.');
        }
        Schedule.add(this, this.delay);
        Schedule.advance().act();
    }
    
};

Actor.moveTo = function(targetX, targetY) {
    // A list of directions in which the actor can move
    var directions = [];
    // A list of distances between the target tile and the goal
    var distances = [];
    for (var x = -1; x < 2; x++) {
        for (var y = -1; y < 2; y++) {
            if (passable.call(this, this.x + x, this.y + y)) {
                directions.push([x, y]);
                distances.push(distance(this.x + x - targetX, this.y + y - targetY));
            }
        }
    }
    // shuffle the directions and distances
    var j, temp;
    for (var i = distances.length - 1; i > 0; i--) {
        j = Math.floor((i + 1) * game.prng.random());
        temp = directions[i];
        directions[i] = directions[j];
        directions[j] = temp;
        temp = distances[i];
        distances[i] = distances[j];
        distances[j] = temp;
    }
    // find the direction with the smallest distance
    var minDistance = Infinity;
    var direction = [0, 0];
    for (var i = 0; i < distances.length; i++) {
        if (distances[i] < minDistance) {
            minDistance = distances[i];
            direction = directions[i];
        }
    }
    return direction;
};

Actor.moveFrom = function(targetX, targetY) {
    // A list of directions in which the actor can move
    var directions = [];
    // A list of distances between the target tile and the goal
    var distances = [];
    for (var x = -1; x < 2; x++) {
        for (var y = -1; y < 2; y++) {
            if (passable.call(this, this.x + x, this.y + y)) {
                directions.push([x, y]);
                distances.push(distance(this.x + x - targetX, this.y + y - targetY));
            }
        }
    }
    // shuffle the directions and distances
    var j, temp;
    for (var i = distances.length - 1; i > 0; i--) {
        j = Math.floor((i + 1) * game.prng.random());
        temp = directions[i];
        directions[i] = directions[j];
        directions[j] = temp;
        temp = distances[i];
        distances[i] = distances[j];
        distances[j] = temp;
    }
    // find the direction with the largest distance
    var maxDistance = 0;
    var direction = [0, 0];
    for (var i = 0; i < distances.length; i++) {
        if (distances[i] > maxDistance) {
            maxDistance = distances[i];
            direction = directions[i];
        }
    }
    return direction;
};

Actor.doAttack = function() {
    if (this.attackDirection[0] === 0 && this.attackDirection[1] === 0) {
        return false;
    } else {
        var targetX = this.x + this.attackDirection[0];
        var targetY = this.y + this.attackDirection[1];
        for (var i = 0; i < game.level.monsters.length; i++) {
            var monster = game.level.monsters[i];
            if (targetX === monster.x && targetY === monster.y) {
                this.attackType = 'kill';
                this.attackTarget = monster;
                if (this.name === 'player') {
                    this.attackType = 'playerkill';
                }
                monster.dead = true;
                game.level.monsters.splice(i, 1);
            }
        }
        if (targetX === game.player.x && targetY === game.player.y) {
            this.attackType = 'kill';
            Buffer.log('The ' + this.name + ' kills you. You die . . .');
            return true;
        }

        if (this.attackType === 'feint') {
            Buffer.log('The ' + this.name + ' swings at the air.');
        }
        else if (this.attackType === 'playerfeint') {
            Buffer.log('You swing at the air.');
        }
        else if (this.attackType === 'dodge') {
            Buffer.log('The ' + this.attackTarget.name + ' dodges the ' + this.name + '\'s attack.');
        }
        else if (this.attackType === 'dodgeplayer') {
            Buffer.log('The ' + this.attackTarget.name + ' dodges your attack.');
        }
        else if (this.attackType === 'playerdodge') {
            Buffer.log('You dodge the ' + this.name + '\'s attack.');
        }
        else if (this.attackType === 'kill') {
            Buffer.log('The ' + this.name + ' kills the ' + this.attackTarget.name + '.');
        }
        else if (this.attackType === 'playerkill') {
            Buffer.log('You kill the ' + this.attackTarget.name + '.');
        }

        this.attackDirection = [0, 0];
        this.attackTarget = undefined;
        if (this.name === 'player') {
            game.level.draw(this);
            var actor = this;
            setTimeout(function() {
                Schedule.add(actor, actor.delay);
                Schedule.advance().act();
            }, 100);
        } else {
            Schedule.add(this, this.delay);
            Schedule.advance().act();
        }
        return true;
    }
};

Actor.act = function() {
    // if the monster is dead
    if (this.dead) {
        Schedule.advance().act();
        return;
    }

    var attacked = this.doAttack();
    if (attacked) {
        return;
    }

    // asleep
    if (this.state === 'asleep') {
        if (game.level.visible[this.x][this.y]) {
            this.state = 'chasing';
            Buffer.log('The ' + this.name + ' notices you.');
        }
        Schedule.add(this, this.delay);
        Schedule.advance().act();
    }
    // chasing
    else if (this.state === 'chasing') {
        if (game.level.visible[this.x][this.y]) {
            var player = window.game.player;
            this.lastSeenTarget = [player.x, player.y];
            if (player.x < this.x) {
                var x = -1;
            } else if (player.x > this.x) {
                var x = 1;
            } else {
                var x = 0;
            }
            if (player.y < this.y) {
                var y = -1;
            } else if (player.y > this.y) {
                var y = 1;
            } else {
                var y = 0;
            }
            if (Math.max(Math.abs(player.x - this.x), Math.abs(player.y - this.y)) > 2) {
                var direction = this.moveTo(player.x, player.y);
                if (direction[0] === 0 && direction[1] === 0) {
                    this.state = 'searching';
                    this.act();
                } else {
                    this.move(direction);
                }
            }
            else if (Math.max(Math.abs(player.x - this.x), Math.abs(player.y - this.y)) === 2) {
                this.attack([x, y]);
            }
            else if (Math.max(Math.abs(player.x - this.x), Math.abs(player.y - this.y)) === 1) {
                var direction = this.moveFrom(player.x, player.y);
                if (direction[0] === 0 && direction[1] === 0) {
                    this.attack([x, y]);
                } else {
                    this.move(direction);
                }
            }
        } else {
            this.state = 'searching';
            this.act();
        }
    }
    // searching
    else if (this.state === 'searching') {
        if (game.level.visible[this.x][this.y]) {
            this.state = 'chasing';
            Schedule.add(this, this.delay);
            Schedule.advance().act();
        } else {
            var direction = this.moveTo(this.lastSeenTarget[0], this.lastSeenTarget[1]);
            if (direction[0] === 0 && direction[1] === 0) {
                this.state = 'asleep';
                this.act();
            } else {
                this.move(direction);
            }
        }
    }
};

// An object containing the prototypes of the actors
// These prototypes inherit from the Actor prototype
var Actors = {};

Actors.player = Object.create(Actor);
Actors.player.name = 'player';

Actors.duelist = Object.create(Actor);
Actors.duelist.name = 'dragon';

Actors.coward = Object.create(Actor);
Actors.coward.name = 'rat';
Actors.coward.act = function() {
    // if the monster is dead
    if (this.dead) {
        Schedule.advance().act();
        return;
    }

    var attacked = this.doAttack();
    if (attacked) {
        return;
    }

    // asleep
    if (this.state === 'asleep') {
        if (game.level.visible[this.x][this.y]) {
            this.state = 'chasing';
            Buffer.log('The ' + this.name + ' notices you.');
        }
        Schedule.add(this, this.delay);
        Schedule.advance().act();
    }
    // chasing
    else if (this.state === 'chasing') {
        if (game.level.visible[this.x][this.y]) {
            var player = window.game.player;
            this.lastSeenTarget = [player.x, player.y];
            if (player.x < this.x) {
                var x = -1;
            } else if (player.x > this.x) {
                var x = 1;
            } else {
                var x = 0;
            }
            if (player.y < this.y) {
                var y = -1;
            } else if (player.y > this.y) {
                var y = 1;
            } else {
                var y = 0;
            }
            // see if there are any other monsters in the player's sight
            var afraid = true;
            for (var i = 0; i < game.level.monsters.length; i++) {
                var monster = game.level.monsters[i];
                if (game.level.visible[monster.x][monster.y] && monster !== this) {
                    afraid = false;
                }
            }
            if (afraid) {
                var direction = this.moveFrom(player.x, player.y);
                if (direction[0] === 0 && direction[1] === 0) {
                    this.attack([x, y]);
                } else {
                    this.move(direction);
                }
            }
            else if (Math.max(Math.abs(player.x - this.x), Math.abs(player.y - this.y)) > 1) {
                var direction = this.moveTo(player.x, player.y);
                if (direction[0] === 0 && direction[1] === 0) {
                    this.state = 'searching';
                    this.act();
                } else {
                    this.move(direction);
                }
            }
            else if (Math.max(Math.abs(player.x - this.x), Math.abs(player.y - this.y)) === 1) {
                this.attack([x, y]);
            }
        } else {
            this.state = 'searching';
            this.act();
        }
    }
    // searching
    else if (this.state === 'searching') {
        if (game.level.visible[this.x][this.y]) {
            this.state = 'chasing';
            Schedule.add(this, this.delay);
            Schedule.advance().act();
        } else {
            var direction = this.moveTo(this.lastSeenTarget[0], this.lastSeenTarget[1]);
            if (direction[0] === 0 && direction[1] === 0) {
                this.state = 'asleep';
                this.act();
            } else {
                this.move(direction);
            }
        }
    }
};

var newActor = function(name) {
    var actor = Object.create(Actors[name]);
    return actor;
};