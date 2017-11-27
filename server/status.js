const _ = require('lodash');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsPlugins = require('@warp-works/warpjs-plugins');

const packageJson = require('./../package.json');

function getRoutes() {
    return _.reduce(
        RoutesInfo.all(),
        (memo, route, key) => _.extend({}, memo, {
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
            routes: getRoutes(),
            plugins: warpjsPlugins.info()
        }, null, 2))
    ;
};
