// const debug = require('debug')('W2:portal:resources/users-by-relationship');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const previewByEntity = require('./preview-by-entity');

module.exports = (persistence, relationship, instance) => Promise.resolve()
    .then(() => relationship
        ? Promise.resolve()
            .then(() => relationship.getDocuments(persistence, instance))
            .then((users) => users.filter((user) => user.Name !== 'TEMPLATE'))
            .then((users) => Promise.map(
                users,
                (user) => previewByEntity(persistence, relationship.getTargetEntity(), user)
            ))
            .then((users) => users.map((user) => {
                if (!user._links.image) {
                    user.link('image', `${RoutesInfo.expand('W2:app:static')}/images/default-user.svg`);
                }
                return user;
            }))
        : null
    )
;
