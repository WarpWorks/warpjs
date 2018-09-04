// const debug = require('debug')('W2:content:inline-edit/update-data-basic-property');
const Promise = require('bluebird');

module.exports = (persistence, entity, instance, body) => Promise.resolve()
    .then(() => entity.getBasicPropertyById(body.reference.id))
    .then((basicProperty) => basicProperty.setValue(instance, body.newValue))
;
