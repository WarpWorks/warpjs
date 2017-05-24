const _ = require('lodash');
const rc = require('@quoin/node-rc');

const packageJson = require('./../package.json');

const baseConfig = {
    cookieSecret: 'ThisC00k1eISsw33t',
    jwtSecret: 'cannotGuessThi$',
    jwtCookieName: 'i3cPortalJWT',
    domainName: 'IIC',
    mapMarkerType: "HotSpot",
    mapTypes: ["IndustrySector", "ApplicationArea", "StandardsOrganization", "TechnologyArea"],
    persistence: {
        host: process.env.MONGODB_HOST || 'localhost',
        dbName: 'IIC',
        usersType: 'Users'
    },

    folders: {
        iicData: 'REPLACE_THIS'
    }
};

const config = rc(packageJson.name, baseConfig);

module.exports = _.extend(config, {
    serverVersion: packageJson.version,
    serverStarted: new Date()
});
