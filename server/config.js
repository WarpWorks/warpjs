const path = require('path');
const rc = require('@quoin/node-rc');

const packageJson = require('./../package.json');

const processCwd = path.dirname(require.resolve('./../package.json'));

const baseConfig = {
    persistence: {
        module: 'REPLACE_ME',
        host: process.env.MONGODB_HOST || 'localhost',
        name: 'REPLACE_ME'
    },
    projectPath: process.env.PROJECT_PATH || path.join(processCwd, '..', 'w2projects'),
    public: process.env.PUBLIC_PATH || path.join(processCwd, '..', 'w2projects', 'public'),
    previews: {
        relationshipPath: [],
        overviewPath: []
    },
    roles: {
        admin: 'admin',
        content: 'content'
    },
    plugins: []
};

const config = rc(packageJson.name, baseConfig, {
    serverVersion: packageJson.version,
    serverStarted: (new Date()).toString()
});

module.exports = config;
