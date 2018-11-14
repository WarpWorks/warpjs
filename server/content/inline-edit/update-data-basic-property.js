const ChangeLogs = require('@warp-works/warpjs-change-logs');
// const debug = require('debug')('W2:content:inline-edit/update-data-basic-property');
const Promise = require('bluebird');

module.exports = (persistence, entity, instance, body, req) => Promise.resolve()
    .then(() => entity.getBasicPropertyById(body.reference.id))
    .then((basicProperty) => Promise.resolve()
        .then(() => ChangeLogs.add(ChangeLogs.ACTIONS.UPDATE_VALUE, req.warpjsUser, instance, {
            key: body.field,
            oldValue: basicProperty.getValue(instance),
            newValue: body.newValue
        }))
        .then(() => basicProperty.setValue(instance, body.newValue))
    )

;
