const _ = require('lodash');
const rc = require('rc');

const packageJson = require('./../package.json');

const baseConfig = {
    domain: 'I3C',
    columnType: 'IndustrySectors',
    rowType: 'ApplicationAreas',
    hotspotType: 'I3CHotSpot'
};

const config = _.clone(rc(packageJson.name, baseConfig));

// Remove extra properties added by `rc` module.
delete config._;
delete config.config;
delete config.configs;

module.exports = _.extend(config, {
    serverVersion: packageJson.version,
    serverStarted: new Date()
});
