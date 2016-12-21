const Model = require ('../model');

class Float extends Model {
    constructor (frandre) {
        super (frandre);
        this.resize (150, 50);

        this.addInPort ('in');
        this.setLabel ('float');
    }

    handleEvents ({in: evs}) {
        for (let e of evs)
            this.position (e[0] - 75, e[1] - 25);
    }
}

module.exports = Float;
