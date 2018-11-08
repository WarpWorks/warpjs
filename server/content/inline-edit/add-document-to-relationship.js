const Promise = require('bluebird');

module.exports = (req, persistence, entity, instance, resource, body) => Promise.resolve()
    .then(() => Promise.resolve()
        .then(() => entity.addEmbedded(instance, body.docLevel, 0))
        .then((newInstance) => Promise.resolve()
            .then(() => {
                resource.newParagraph = newInstance;
            })
            .then(() => newInstance)
        )
    )
;
