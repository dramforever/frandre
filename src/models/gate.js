const Model = require ('../model');

class Gate extends Model {
    constructor (frandre) {
        super (frandre);
        this.resize (150, 50);

        this.addInPort ('in');
        this.addOutPort ('out');
        this.setLabel ('gate');
        this.enabled = false;
        this.view().on ('cell:pointerclick', () => {
            this.enabled = ! this.enabled;
            this.view().$el.attr ('fill', this.enabled ? '#66ccff' : '#ffffff');
        });

    }

    getStrongDeps (label) {
        return ['out'];
    }

    handleEvents ({in: evs}) {
        if (this.enabled)
            return {'out': evs};
        else
            return {};
    }
}

module.exports = Gate;
