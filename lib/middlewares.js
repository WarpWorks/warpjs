const WarpJSError = require('./error');
const config = require('./config');

function hasAdminRole(role) {
    return role.label === config.roles.admin;
}

function hasContentRole(role) {
    return role.label === config.roles.content || role.label === config.roles.admin;
}

function canAccess(impl, userObjectProperty, req, res, next) {
    const user = req[userObjectProperty];

    if (!user) {
        next(new WarpJSError("Unauthenticated user."));
    } else {
        const isContent = Boolean(user.Roles && user.Roles.filter(impl).length);
        next(isContent ? undefined : new WarpJSError("Unauthorized user."));
    }
}

module.exports = {
    canAccessAsAdmin: canAccess.bind(null, hasAdminRole),
    canAccessAsContentManager: canAccess.bind(null, hasContentRole)
};
