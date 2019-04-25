class Notification {
    static async addToUser(persistence, userEntity, user, instance) {
        if (!user) {
            return;
        }

        // In case the modified document is the user's document.
        if (user.type === instance.type && user.id === instance.id) {
            user = instance;
        }

        if (!user._meta) {
            user._meta = {};
        }

        if (!user._meta.notifications) {
            user._meta.notifications = [];
        }

        const duplicate = user._meta.notifications.find((notification) => notification.type === instance.type && notification.id === instance.id);
        if (!duplicate) {
            user._meta.notifications.push({
                type: instance.type,
                typeID: instance.typeID,
                id: instance.id
            });

            await userEntity.updateDocument(persistence, user, true);
        }
    }
}

Notification.displayName = 'Notification';

module.exports = Notification;
