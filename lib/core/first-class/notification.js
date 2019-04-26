const debug = require('./debug')('notification');

class Notification {
    constructor(domainName, notificationJson) {
        this.domainName = domainName;
        this.notificationJson = notificationJson;
    }

    async toNotificationListResource(persistence) {
        const getEntity = require('./get-entity');
        const entity = await getEntity(this.domainName, this.notificationJson.type);
        const documentJson = await entity.getInstance(persistence, this.notificationJson.id);
        debug(`TODO: documentJson=`, documentJson);
    }

    static async addToUser(persistence, userEntity, userJson, instance) {
        if (!userJson) {
            return;
        }

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
        if (!duplicate) {
            userJson._meta.notifications.push({
                type: instance.type,
                typeID: instance.typeID,
                id: instance.id
            });

            await userEntity.updateDocument(persistence, userJson, true);
        }
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
