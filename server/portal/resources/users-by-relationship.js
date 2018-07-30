// const debug = require('debug')('W2:portal:resources/users-by-relationship');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const overviewByEntity = require('./overview-by-entity');

module.exports = (persistence, relationship, instance) => Promise.resolve()
    .then(() => {
        if (relationship) {
            return Promise.resolve()
                .then(() => relationship.getDocuments(persistence, instance))
                .then((users) => users.sort(warpjsUtils.byPositionThenName))
                .then((users) => Promise.map(users, (user) => Promise.resolve()
                    .then(() => RoutesInfo.expand('entity', {
                        type: user.type,
                        id: user.id
                    }))
                    .then((href) => warpjsUtils.createResource(href, {
                        name: user.Name,
                        description: user.Description
                    }))

                    .then((resource) => Promise.resolve()
                        // Get display image
                        .then(() => overviewByEntity(persistence, relationship.getTargetEntity(), user))
                        .then((overview) => overview && overview._embedded ? overview._embedded.items : null)
                        .then((paragraphs) => paragraphs && paragraphs.length ? paragraphs[0] : null)
                        .then((paragraph) => paragraph && paragraph._embedded ? paragraph._embedded.images : null)
                        .then((images) => images && images.length ? images[0] : null)
                        .then((image) => image && image._links ? image._links.self : null)
                        .then((link) => link ? link.href : null)
                        .then((imageRef) => imageRef || `${RoutesInfo.expand('W2:app:static')}/images/default-user.svg`
                        )
                        .then((imageRef) => resource.link('image', imageRef))

                        .then(() => resource)
                    )
                ));
        } else {
            return null;
        }
    })
;
