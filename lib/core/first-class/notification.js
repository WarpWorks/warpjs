const cloneDeep = require('lodash/cloneDeep');
const Promise = require('bluebird');

const ChangeLogs = require('@warp-works/warpjs-change-logs');
const RoutesInfo = require('@quoin/expressjs-routes-info');

// const debug = require('./debug')('notification');
const Document = require('./document');
const previewImageByEntity = require('./../../../server/portal/resources/preview-image-by-entity');

const STATIC_NAME = 'W2:app:static';

class Notification {
    constructor(domainName, notificationJson) {
        this.domainName = domainName;
        this.notificationJson = notificationJson;
    }

    async toNotificationListResource(persistence) {
        const getEntity = require('./get-entity');
        const DEFAULT_IMAGE_URL = `${RoutesInfo.expand(STATIC_NAME, {})}/images/default-user.svg`;

        const entity = await getEntity(this.domainName, this.notificationJson.type);
        const userEntity = await getEntity(this.domainName, 'User');
        const documentJson = await entity.getInstance(persistence, this.notificationJson.id);

        const doc = new Document(this.domainName, documentJson);
        const resource = doc.toNotificationListResource();
        resource.relnType = cloneDeep(this.notificationJson.relnType);

        const changeLogs = await ChangeLogs.toNotificationResource(persistence, entity.getDomain(), documentJson);
        changeLogs.items = changeLogs.items.slice(0, 25);
        changeLogs.items.forEach((item) => {
            // FIXME: Should use DocLevel.
            if (item.helpText) {
                const levels = item.helpText.split('.');
                const parts = levels[levels.length - 1].split(':');
                if (parts.length === 2 && parts[0] === 'Enum') {
                    item.isEnum = true;
                }
            }
        });

        // Update the document's lastUpdated to be the most recent changeLog's
        // timestamp. This is because the lastUpdated is modified at any update
        // (like when the user follows a document).
        resource.lastUpdated = changeLogs.items[0].timestamp;

        const previewImageCache = {};

        // Let's add the preview image for the users.
        await Promise.each(
            changeLogs.items,
            async (changeLog) => {
                if (!previewImageCache[changeLog.user.id]) {
                    if (changeLog.user.id === '-1') {
                        previewImageCache[changeLog.user.id] = DEFAULT_IMAGE_URL;
                    } else {
                        const userDocument = await userEntity.getInstance(persistence, changeLog.user.id);
                        const previewImage = await previewImageByEntity(persistence, userEntity, userDocument);
                        previewImageCache[changeLog.user.id] = previewImage || DEFAULT_IMAGE_URL;
                    }
                }
                changeLog.user.image = previewImageCache[changeLog.user.id];
            }
        );

        resource.changeLogs = changeLogs.items;

        return resource;
    }

    static async addToUser(persistence, domainName, userJson, instance, relnType) {
        if (!userJson) {
            return;
        }

        const getEntity = require('./get-entity');
        const userEntity = await getEntity(domainName, userJson.type);

        // In case the modified document is the user's document.
        if (userJson.type === instance.type && userJson.id === instance.id) {
            userJson = instance;
        }

        if (!userJson._meta) {
            userJson._meta = {};
        }

        if (!userJson._meta.notifications) {
            userJson._meta.notifications = [];
        }

        const duplicate = userJson._meta.notifications.find((notification) => notification.type === instance.type && notification.id === instance.id);
        if (duplicate) {
            duplicate.relnType[relnType] = true;
        } else {
            userJson._meta.notifications.push({
                type: instance.type,
                typeID: instance.typeID,
                id: instance.id,
                relnType: { [relnType]: true }
            });
        }
        await userEntity.updateDocument(persistence, userJson, false);
    }

    static fromUser(domainName, userJson) {
        if (userJson && userJson._meta && userJson._meta.notifications) {
            return userJson._meta.notifications.map((notification) => new this(domainName, notification));
        } else {
            return [];
        }
    }
}

Notification.displayName = 'Notification';

module.exports = Notification;
