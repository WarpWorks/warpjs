const _ = require('lodash');
const hal = require('hal');
const url = require('url');

const I3CError = require('./error');
const mongoData = require('./map/mongo-data');
const pathInfo = require('./path-info');
const Persistence = require('./persistence');

const HAL_CONTENT_TYPE = 'application/hal+json';

function createResource(reqOrPath, data) {
    if (typeof reqOrPath === 'string') {
        return new hal.Resource(data, reqOrPath || '[undefined]');
    }
    return new hal.Resource(data, (reqOrPath && reqOrPath.originalUrl) || '[undefined]');
}

function urlFormat(pathname, query) {
    return url.format({
        pathname,
        query
    });
}

function sendHal(req, res, resource, status) {
    resource.copyrightYear = (new Date()).getFullYear();

    resource.link('i3c_homepage', {
        href: '/',
        title: "Home page"
    });

    if (req.i3cUser) {
        resource.user = req.i3cUser;
    }

    if (resource.hideLoginHeader) {
        // This is the login page, so we want to be sure that
        // both links are available.
        resource.link('i3c_login', {
            href: pathInfo(pathInfo.SESSION),
            title: "Login"
        });
        resource.link('i3c_logout', {
            href: pathInfo(pathInfo.SESSION, 'logout', {}),
            title: "Logout"
        });
    } else if (req.i3cUser) {
        resource.link('i3c_logout', {
            href: pathInfo(pathInfo.SESSION, 'logout', {}),
            title: "Logout"
        });
    } else {
        resource.link('i3c_login', {
            href: pathInfo(pathInfo.SESSION),
            title: "Login"
        });
    }

    res.status(status || 200)
        .header('Content-Type', HAL_CONTENT_TYPE)
        .send(resource.toJSON());
}

function sendIndex(res, title, bundle) {
    res.status(200).render('index', {
        title,
        bundle
    });
}

function wrapWith406(res, formats) {
    res.format(_.extend({}, formats, {
        'default': () => {
            res.status(406).send("Unknown Accept header");
        }
    }));
}

function sendError(req, res, err) {
    // TODO: Log this.
    let resource;
    console.log("Catch(err)=", err);

    if (err instanceof mongoData.MapError) {
        if (err.originalError instanceof Persistence.PersistenceError) {
            resource = createResource(req, {
                message: "Error accessing database.",
                details: err.message
            });
        } else if (err.originalError instanceof I3CError) {
            resource = createResource(req, {
                message: "General application error.",
                details: err.message
            });
        } else {
            resource = createResource(req, {
                message: "Map data processing error.",
                details: err.message
            });
        }
    } else if (err instanceof Persistence.PersistenceError) {
        resource = createResource(req, {
            message: "Error accessing database.",
            details: err.message
        });
    } else {
        resource = createResource(req, {
            message: "Unknown error.",
            details: err.message
        });
    }
    sendHal(req, res, resource, 500);
}

module.exports = {
    HAL_CONTENT_TYPE,
    createResource,
    sendHal,
    sendError,
    sendIndex,
    urlFormat,
    wrapWith406
};
