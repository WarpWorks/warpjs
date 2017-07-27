const path = require('path');
const rc = require('@quoin/node-rc');

const packageJson = require('./../../package.json');

const processCwd = process.cwd();

const warpjsFolder = path.dirname(require.resolve('./../../package.json'));

const baseConfig = {
    persistence: {
        host: process.env.MONGODB_HOST || 'localhost',
        name: 'REPLACE-ME'
    },
    cartridgePath: process.env.CARTRIDGE_PATH || warpjsFolder,
    outputPath: process.env.OUTPUT_PATH || warpjsFolder,
    projectPath: process.env.PROJECT_PATH || path.join(processCwd, "..", "w2projects")
};

const postConfig = {
    serverVersion: packageJson.version,
    serverStarted: (new Date()).toString()
};

const config = rc(packageJson.name, baseConfig, postConfig);

module.exports = config;
