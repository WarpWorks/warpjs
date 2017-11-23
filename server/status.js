const _ = require('lodash');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const packageJson = require('./../package.json');
const pluginCache = require('./plugins/cache');

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
            plugins: pluginCache.map((plugin) => plugin.info())
        }, null, 2))
    ;
};
