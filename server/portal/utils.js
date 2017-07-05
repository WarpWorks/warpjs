const _ = require('lodash');
const hal = require('hal');
const Persistence = require('@warp-works/warpjs-mongo-persistence');
// const RoutesInfo = require('@quoin/expressjs-routes-info');
const url = require('url');

const constants = require('./../../lib/constants');

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
        // resource.link('i3c_login', {
        //     href: RoutesInfo.expand('login'),
        //     title: "Login"
        // });
        // resource.link('i3c_logout', {
        //     href: RoutesInfo.expand('logout'),
        //     title: "Logout"
        // });
    } else if (req.i3cUser) {
        // resource.link('i3c_logout', {
        //     href: RoutesInfo.expand('logout'),
        //     title: "Logout"
        // });
    } else {
        // resource.link('i3c_login', {
        //     href: RoutesInfo.expand('login'),
        //     title: "Login"
        // });
    }

    // resource.link('mapBrowser', {
    //     href: RoutesInfo.expand('map'),
    //     title: "Map Browser"
    // });
    resource.link('mapBrowserImage', {
        // TODO: Cannot use this because tests will fail.
        // href: `${req.app.get('public-folder-path')}/iic_images/map-browser-icon.png`,
        href: `/public/iic_images/map-browser-icon.png`,
        title: "I3C Map"
    });

    res.status(status || 200)
        .header('Content-Type', constants.HAL_CONTENT_TYPE)
        .send(resource.toJSON());
}

function sendIndex(res, title, bundle) {
    res.status(200).render('index', {
        title,
        bundle,
        baseUrl: res.app.get('base-url'),
        staticUrl: res.app.get('static-url')
    });
}

function wrapWith406(res, formats) {
    res.format(_.extend({}, formats, {
        default: () => {
            res.status(406).send("Unknown Accept header");
        }
    }));
}

function sendError(req, res, err) {
    // TODO: Log this.
    let resource;
    console.log("Catch(err)=", err);

    if (err instanceof Persistence.Error) {
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
    HAL_CONTENT_TYPE: constants.HAL_CONTENT_TYPE,
    createResource,
    sendHal,
    sendError,
    sendIndex,
    urlFormat,
    wrapWith406
};
