const extend = require('lodash/extend');
const reduce = require('lodash/reduce');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const RoutesInfoPackageJson = require('@quoin/expressjs-routes-info/package.json');
const warpjsPlugins = require('@warp-works/warpjs-plugins');
const warpjsUtilsPackageJson = require('@warp-works/warpjs-utils/package.json');

const packageJson = require('./../package.json');

const serverStarted = (new Date()).toString();

function getRoutes() {
    return reduce(
        RoutesInfo.all(),
        (memo, route, key) => extend({}, memo, {
            [route.name]: route.pathname
        }),
        {}
    );
}

module.exports = (req, res) => {
    res.status(200)
        .set('Content-Type', 'text/plain')
        .send(JSON.stringify({
            version: packageJson.version,
            serverStarted,
            misc: {
                warpjsUtils: warpjsUtilsPackageJson.version,
                routesInfo: RoutesInfoPackageJson.version
            },
            routes: getRoutes(),
            plugins: warpjsPlugins.info()
        }, null, 2))
    ;
};
