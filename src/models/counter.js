const Model = require ('../model');

class Counter extends Model {
    constructor (frandre) {
        super (frandre);
        this.resize (150, 50);

        this.addInPort ('in');
        this.count = 0;
        this.updateCounter ();
    }

    handleEvents ({in: evs}) {
        for (let x of evs)
            this.count += x;
        this.updateCounter ();
    }

    updateCounter () {
        this.setLabel (Math.floor(this.count).toString ());
    }
}

module.exports = Counter;
