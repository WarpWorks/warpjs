const _ = require('lodash');
const rc = require('rc');

const packageJson = require('./../package.json');

const baseConfig = {
    cookieSecret: 'ThisC00k1eISsw33t',
    jwtSecret: 'cannotGuessThi$',
    jwtCookieName: 'i3cPortalJWT',
    domainName: 'IIC',
    mapTypes: ["IndustrySector", "ApplicationArea", "StandardsOrganization", "TechnologyArea"],
    persistence: {
        host: process.env.MONGODB_HOST || 'localhost',
        dbName: 'IIC',
        columnType: 'IndustrySector',
        columnSubType: 'IndustryVertical',
        rowType: 'ApplicationArea',
        rowSubType: 'UseCase',
        hotspotType: 'HotSpot',
        usersType: 'Users'
    },

    folders: {
        iicData: 'REPLACE_THIS'
    }
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
