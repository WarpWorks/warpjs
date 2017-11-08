const Promise = require('bluebird');

const extractUser = require('./extract-user');

module.exports = (persistence, entity, instance, relationshipName) => Promise.resolve()
    .then(() => entity.getRelationshipByName(relationshipName))
    .then((relationship) => Promise.resolve()
        .then(() => relationship ? relationship.getDocuments(persistence, instance) : [])
        .then((users) => Promise.map(users, (user) => extractUser(persistence, relationship.getTargetEntity(), user)))
    )
;
