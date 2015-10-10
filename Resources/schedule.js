// JS implementation of DeltaClock by Jeff Lund

var Schedule = {
    next: undefined
};

// Add an actor at the schedule
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

Schedule.advance = function() {
    if (!this.next) {
        return undefined;
    }
    var actor = this.next.actor;
    this.next = this.next.next;
    return actor;
};


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