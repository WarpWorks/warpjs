const Promise = require('bluebird');

const ComplexTypes = require('./../../../lib/core/complex-types');

let IMPL;

module.exports = (persistence, entity, instance, docLevel, relativeToDocument) => Promise.resolve()

    // Avoid cycle dependency.
    .then(() => {
        if (!IMPL) {
            IMPL = {
                [ComplexTypes.Action]: require('./action'),
                [ComplexTypes.BasicPropertyPanelItem]: require('./basic-property-panel-item'),
                [ComplexTypes.RelationshipPanelItem]: require('./relationship-panel-item'),
            };
        }
    })
    .then(() => IMPL[entity.type])
    .then((impl) => {
        if (!impl) {
            throw new Error(`Not implemented for '${entity.type}'.`);
        }
        return impl(persistence, entity, instance, docLevel, relativeToDocument);
    })
;
