const debug = require('debug')('W2:model:Property');
const Promise = require('bluebird');

const Base = require('./base');

class Property extends Base {
    save(persistence, parentID) {
        debug(`Property.save(persistence, parentID=${parentID}`);
        return Promise.resolve()
            .then(() => super.save(persistence, parentID))
        ;
    }
}

module.exports = Property;
