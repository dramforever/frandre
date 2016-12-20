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
    constructor (frandre) {
        super (frandre);
        this.resize (150, 50);

        this.addInPort ('in');
        this.addOutPort ('out');
    }

    getStrongDeps (label) {
        return ['out'];
    }

    handleEvents ({in: evs}) {
        return { out: _.map (evs, this.calculate.bind(this)) };
    }

    calculate (x) {}
}

class Sin extends UnaryFunction {
    constructor (frandre) {
        super (frandre);
        this.setLabel ('sin');
    }

    calculate (x) { return Math.sin(x / 1000) * 100; }
}

module.exports = {
    BinaryFunction: BinaryFunction,
    Plus: Plus,
    Mult: Mult,
    UnaryFunction: UnaryFunction,
    Sin: Sin
};
