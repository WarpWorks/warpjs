const _ = require('lodash');
const hal = require('hal');
const url = require('url');

const pathInfo = require('./path-info');

const HAL_CONTENT_TYPE = 'application/hal+json';

function createResource(req, data) {
    return new hal.Resource(data, req.originalUrl || '[undefined]');
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

function wrapWith406(res, formats) {
    res.format(_.extend({}, formats, {
        'default': () => {
            res.status(406).send("Unknown Accept header");
        }
    }));
}

module.exports = {
    HAL_CONTENT_TYPE,
    createResource,
    sendHal,
    urlFormat,
    wrapWith406
};
