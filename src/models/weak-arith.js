const _ = require ('lodash');
const Model = require ('../model');

class BinaryFunction extends Model {
    constructor (frandre) {
        super (frandre);
        this.resize (150, 50);

        this.addInPort ('s');
        this.addInPort ('w');
        this.addOutPort ('out');

        this.w_val = undefined;
    }

    getStrongDeps (label) {
        if (label == 's') return ['out'];
        else return [];
    }

    handleEvents ({s: s_evs, w: w_evs}) {
        if (w_evs && w_evs.length) this.w_val = _.last(w_evs);
        if (s_evs && s_evs.length)
            return { 'out': _.map (s_evs, (sev) => this.calculate (sev, this.w_val)) };
        else
            return {};
    }

    calculate (s, w) {}
}

class Mult extends BinaryFunction {
    constructor (frandre) {
        super (frandre);
        this.setLabel ('×');
        this.w_val = 0;
    }

    calculate (s, w) {
        if (_.isArray (s)) {
            if (_.isArray (w))
                return _.zipWith (s, w, (a, b) => a * b);
            else
                return _.map (s, (a) => a * w);
        } else {
            if (_.isArray (w))
                return _.map (w, (a) => s * a);
            else
                return s * w;
        }
    }
}

class Plus extends BinaryFunction {
    constructor (frandre) {
        super (frandre);
        this.setLabel ('+');
        this.w_val = 0;
    }

    calculate (s, w) {
        if (_.isArray (s)) {
            if (_.isArray (w))
                return _.zipWith (s, w, (a, b) => a + b);
            else
                return _.map (s, (a) => a + w);
        } else {
            if (_.isArray (w))
                return _.map (w, (a) => s + a);
            else
                return s + w;
        }
    }
}

class UnaryFunction extends Model {
    constructor (frandre, fn, label) {
        super (frandre);
        this.resize (150, 50);
        this.fn = fn;
        this.addInPort ('in');
        this.addOutPort ('out');
        this.setLabel (label);
    }

    getStrongDeps (label) {
        return ['out'];
    }

    handleEvents ({in: evs}) {
        return { out: _.map (evs, this.fn) };
    }
}

class Scale extends UnaryFunction {
    constructor (frandre, sc) {
        super (frandre, (u) => {
            if (_.isArray (u))
                return _.map (u, (t) => sc * t);
            else
                return sc * u;
        }, `${sc}x`);
    }
}

class MakeVector extends Model {
    constructor (frandre) {
        super (frandre);
        this.resize (150, 50);

        this.addInPort ('x');
        this.addInPort ('y');
        this.addOutPort ('out');

        this.last_x = 0;
        this.last_y = 0;

        this.setLabel ('vec');
    }

    getStrongDeps (label) {
        return ['out']
    }

    handleEvents ({x: x_evs, y: y_evs}) {
        if (x_evs) for (let ev of x_evs) this.last_x = ev;
        if (y_evs) for (let ev of y_evs) this.last_y = ev;
        if (x_evs && x_evs.length
            || y_evs && y_evs.length)
            return { out: [[this.last_x, this.last_y]] };
    }
}

module.exports = {
    BinaryFunction: BinaryFunction,
    Plus: Plus,
    Mult: Mult,
    UnaryFunction: UnaryFunction,
    Scale: Scale,
    MakeVector: MakeVector
};
