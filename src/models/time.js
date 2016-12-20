const Model = require ('../model');

class Dt extends Model {
    constructor (frandre) {
        super (frandre);
        this.resize (150, 50);
        this.addOutPort ('out');
        this.setLabel ('δt');
        this.currentTime = 0;
        const handler = (newTime) => {
            this.causeEvent ('out', newTime - this.currentTime);
            this.currentTime = newTime;
            window.requestAnimationFrame (handler);
        };
        window.requestAnimationFrame (handler);
    }
}

class Time extends Model {
    constructor (frandre) {
        super (frandre);
        this.resize (150, 50);
        this.addOutPort ('out');
        this.setLabel ('t');
        const handler = (newTime) => {
            this.causeEvent ('out', newTime);
            window.requestAnimationFrame (handler);
        };
        window.requestAnimationFrame (handler);
    }
}

module.exports = {
    Dt: Dt,
    Time: Time
};
