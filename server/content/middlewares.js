const WarpJSError = require('./error');
const config = require('./config');

function hasAdminRole(role) {
    return role.label === config.roles.admin;
}

function hasContentRole(role) {
    return role.label === config.roles.content || role.label === config.roles.admin;
}

function canAccess(impl, userObjectProperty, req, res, next) {
    // Inject to known property.
    req.warpjsUser = req[userObjectProperty];

    if (!req.warpjsUser) {
        next(new WarpJSError("Unauthenticated user."));
    } else {
        const authorizedRoles = Boolean(req.warpjsUser.Roles && req.warpjsUser.Roles.filter(impl).length);
        next(authorizedRoles ? undefined : new WarpJSError("Unauthorized user."));
    }
}

module.exports = {
    canAccessAsAdmin: canAccess.bind(null, hasAdminRole),
    canAccessAsContentManager: canAccess.bind(null, hasContentRole)
};
