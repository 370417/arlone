// JS implementation of DeltaClock by Jeff Lund

/**
 * A linked list that stores all actors and when they will act.
 * Each event in the list contains an actor, a delta, and the next event.
 * Delta is the time between the previous actor and this one.
 */

var Schedule = {
    next: undefined
};

/**
 * Add an actor to the schedule
 *
 * @param {Actor} The actor to be added
 * @param {number} delta The number of ticks before actor will act
 * @return {Object} The next event added to the schedule
 */
Schedule.add = function(actor, delta) {
    var prev = this;
    var next = this.next;
    while (next && next.delta <= delta) {
        delta -= next.delta;
        prev = next;
        next = next.next;
    }
    if (next) {
        next.delta -= delta;
    }
    prev.next = {
        actor: actor,
        delta: delta,
        next: next
    };
    return prev.next;
};

/** Advance to the next actor. */
Schedule.advance = function() {
    if (!this.next) {
        return undefined;
    }
    var actor = this.next.actor;
    this.next = this.next.next;
    return actor;
};

/** Remove all instances of actor from the schedule */
Schedule.remove = function(actor) {
    var prev = this;
    var next = this.next;
    while (next) {
        if (next.actor === actor) {
            prev.next = next.next;
            if (prev.next) {
                prev.next.delta += next.delta;
            }
        } else {
            prev = prev.next;
        }
        next = prev.next;
    }
};
