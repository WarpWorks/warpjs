const Base = require('./base');
const debug = require('./debug')('property');

class Property extends Base {
    async save(persistence, parentID) {
        debug(`Property.save(persistence, parentID=${parentID}`);
        return super.save(persistence, parentID);
    }
}

module.exports = Property;
