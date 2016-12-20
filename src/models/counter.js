class Counter extends Model {
    constructor (frandre) {
        super (frandre);
        this.resize (150, 50);

        this.addInPort ('in');
        this.count = 0;
        this.updateCounter ();
    }

    handleEvents ({in: evs}) {
        for (let _x of evs) {
            this.count ++;
        }
        this.updateCounter ();
    }

    updateCounter () {
        this.setLabel (this.count.toString ());
    }
}

module.exports = Counter;
