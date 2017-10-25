const util = require('util'),
      eventEmitter = require('events').EventEmitter;

function Event() {
    eventEmitter.call(this);
}

util.inherits(Event, eventEmitter);

Event.prototype.event = function(type, data) {
    this.emit(type, data);
}

var global = new Event();
module.exports = {
    emitter: Event,
    global: global
}