"use strict";

const joint = require ('jointjs');

class Model extends joint.shapes.devs.Model {
    constructor (frandre) {
        super ({
            ports: {
                groups: {
                    'in': {
                        markup: '<path class="port-body" stroke="black" d="M 0,-10 L 0,10 L 16,0 z"/>',
                        attrs: {
                            '.port-body': { magnet: 'passive' }
                        },
                        label: { position: {
                            name: 'right',
                            args: { x: 20, y: 0 }
                        }}
                    },
                    'out': {
                        markup: '<path class="port-body" stroke="black" d="M 0,-10 L 0,10 L 16,10 L 16,-10 z"/>',
                        label: { position: 'left' }
                    }
                }
            }
        });
        this.pendingEvents = {};
        this.frandre = frandre;
        frandre.graph.addCell (this);
    }

    getStrongDeps (label) { return []; }

    handleEvents (evs) { return {};  }

    addEvent (label, value) {
        if (! this.pendingEvents.hasOwnProperty[label])
            this.pendingEvents[label] = [];

        this.pendingEvents[label].push (value);
    }

    bumpEvents () {
        const res = this.handleEvents (this.pendingEvents);
        this.pendingEvents = {};
        return res;
    }

    causeEvent (label, value) {
        this.frandre.currentEvents.push ([this.id, label, value]);
        if (! this.frandre.handlingEvents)
            this.frandre.processEvents ();
    }

    setLabel (text) {
        this.view ().$el.find ('.label').text (text);
    }

    view () {
        return this.findView (this.frandre.paper);
    }
}

module.exports = Model
