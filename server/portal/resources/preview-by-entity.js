const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const overviewByEntity = require('./overview-by-entity');

module.exports = (persistence, entity, instance) => Promise.resolve()
    .then(() => RoutesInfo.expand('entity', {
        type: instance.type,
        id: instance.id
    }))
    .then((href) => warpjsUtils.createResource(href, {
        type: instance.type,
        id: instance.id,
        name: instance.Name,
        label: instance.Label || instance.Name
    }))
    .then((resource) => Promise.resolve()
        .then(() => overviewByEntity(persistence, entity, instance))
        .then((overview) => overview && overview._embedded ? overview._embedded.items : null)
        .then((paragraphs) => paragraphs && paragraphs.length ? paragraphs[0] : null)
        .then((paragraph) => Promise.resolve()
            .then(() => paragraph ? paragraph.description : null)
            .then((description) => {
                if (description) {
                    resource.description = description;
                }
            })

            .then(() => paragraph && paragraph._embedded ? paragraph._embedded.images : null)
            .then((images) => images && images.length ? images[0] : null)
            .then((image) => image && image._links ? image._links.self : null)
            .then((self) => {
                if (self && self.href) {
                    resource.link('image', self.href);
                }
            })
        )
        .then(() => resource)
    )
;
