const Promise = require('bluebird');

const ComplexTypes = require('./../../../lib/core/complex-types');
const warpCore = require('./../../../lib/core');

module.exports = (persistence) => Promise.resolve()
    .then(() => warpCore.getCoreDomain())
    .then((domainModel) => domainModel.getEntityByName(ComplexTypes.Domain))
    .then((entityModel) => Promise.resolve()
        .then(() => entityModel.getDocuments(persistence))
        .then((entityInstances) => ({
            entity: entityModel,
            instances: entityInstances
        }))
    )
;
