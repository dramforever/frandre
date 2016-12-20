const Model = require ('../model');

class Mouse extends Model {
    constructor (frandre) {
        super (frandre);
        this.resize (150, 50);

        this.addOutPort ('out');
        this.setLabel ('mouse');

        window.addEventListener ('mousemove', (e) =>
            this.causeEvent ('out', [
                e.clientX - this.frandre.paper.options.origin.x,
                e.clientY - this.frandre.paper.options.origin.y
            ]));
    }
}

module.exports = Mouse;
