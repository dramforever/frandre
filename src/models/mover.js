class Counter extends Model {
    constructor (frandre) {
        super (frandre);
        this.resize (150, 50);

        this.addInPort ('up');
        this.addInPort ('down');

        this.setLabel ('');
    }

    handleEvents ({up: up_evs, down: down_evs }) {
        for (let _x of up_evs || []) {
            this.moveUp ();
        }
        for (let _x of down_evs || []) {
            this.moveDown ();
        }
    }

    moveUp () {
        const {x, y} = this.position ();
        this.position (x, y - 10);
    }

    moveDown () {
        const {x, y} = this.position ();
        this.position (x, y + 10);
    }
}

module.exports = Counter;
