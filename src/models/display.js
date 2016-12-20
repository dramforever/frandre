const Model = require ('../model');

class Display extends Model {
    constructor (frandre) {
        super (frandre);
        this.resize (250, 50);

        this.addInPort ('in');
        this.setLabel ('');
    }

    handleEvents ({in: evs}) {
        for (let x of evs)
            this.setLabel (x.toString ());
    }
}

module.exports = Display;
