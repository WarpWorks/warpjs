const debug = require('debug')('W2:portal:resources/users-by-relationship');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const previewByEntity = require('./preview-by-entity');
const visibleOnly = require('./visible-only');
const workingForByUser = require('./working-for-by-user');

module.exports = async (persistence, relationship, instance) => {
    if (relationship) {
        const targetEntity = relationship.getTargetEntity();

        const users = await relationship.getDocuments(persistence, instance);
        const visibleUsers = users.filter(visibleOnly);

        const userResources = await Promise.map(
            visibleUsers,
            async (user) => {
                const resource = await previewByEntity(persistence, targetEntity, user);

                debug(`user=`, user);
                const companies = await workingForByUser(persistence, targetEntity, user);
                if (companies && companies.length) {
                    resource.embed('companies', companies);
                }

                return resource;
            }
        );

        userResources.forEach((user) => {
            if (!user._links.image) {
                user.link('image', `${RoutesInfo.expand('W2:app:static')}/images/default-user.svg`);
            }
        });

        return userResources;
    } else {
        return null;
    }
};
