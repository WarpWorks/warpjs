const ChangeLogs = require('@warp-works/warpjs-change-logs');
const Promise = require('bluebird');

module.exports = (req, persistence, entity, instance, resource, body) => {
    const action = ChangeLogs.ACTIONS.EMBEDDED_ADDED;
    return Promise.resolve()
        .then(() => Promise.resolve()
            .then(() => entity.addEmbedded(instance, body.docLevel, 0))
            .then((newInstance) => Promise.resolve()
                .then(() => ChangeLogs.add(action, req.warpjsUser, instance, {
                    key: body.docLevel,
                    type: newInstance.type,
                    id: newInstance._id
                }))
                .then(() => {
                    resource.newParagraph = newInstance;
                })
                .then(() => newInstance)
            )
        )
    ;
};
