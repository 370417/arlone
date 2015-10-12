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
    // loop through the schedule until in the correct position
    while (next && next.delta <= delta) {
        delta -= next.delta;
        prev = next;
        next = next.next;
    }
    // update the delta of the next event
    if (next) {
        next.delta -= delta;
    }
    // add the event
    prev.next = {
        actor: actor,
        delta: delta,
        next: next
    };
    return prev.next;
};

/**
 * Advance to the next actor.
 *
 * @return {Actor} The next actor in the schedule
 */
Schedule.advance = function() {
    if (!this.next) {
        return undefined;
    }
    var actor = this.next.actor;
    this.next = this.next.next;
    return actor;
};

/**
 * Remove all instances of actor from the schedule
 *
 * @param {Actor} actor The actor to be removed
 */
Schedule.remove = function(actor) {
    var prev = this;
    var next = this.next;
    while (next) {
        if (next.actor === actor) {
            prev.next = next.next;
            if (prev.next) {
                prev.next.delta += next.delta;
            }
            next = prev.next;
        } else {
            prev = prev.next;
            next = prev.next;
        }
    }
};
