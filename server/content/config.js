const path = require('path');
const rc = require('@quoin/node-rc');

const packageJson = require('./../../package.json');

const processCwd = path.dirname(require.resolve('./../../package.json'));

const baseConfig = {
    mongoServer: process.env.MONGODB_HOST || 'localhost',
    projectPath: process.env.PROJECT_PATH || path.join(processCwd, '..', 'w2projects'),
    public: process.env.PUBLIC_PATH || path.join(processCwd, '..', 'w2projects', 'public'),
    roles: {
        admin: 'admin',
        content: 'content'
    }
};

const config = rc(packageJson.name, baseConfig, {
    serverVersion: packageJson.version,
    serverStarted: (new Date()).toString()
});

module.exports = config;
