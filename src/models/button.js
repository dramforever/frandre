const Model = require ('../model');

class Button extends Model {
    constructor (frandre) {
        super (frandre);
        this.resize (150, 50);
        this.addOutPort ('out');
        this.view ().on ('cell:pointerclick', () => this.causeEvent ('out', 1));
        this.setLabel ('click');
    }
}

module.exports = Button
