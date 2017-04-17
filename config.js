const path = require('path');
const rc = require('@quoin/node-rc');

const packageJson = require('./../package.json');

const processCwd = process.cwd();

const baseConfig = {
    serverVersion: packageJson.version,
    serverStarted: (new Date()).toString(),
    port: process.env.PORT || '3000',
    mongoServer: process.env.MONGODB_HOST || 'localhost',
    cartridgePath: process.env.CARTRIDGE_PATH || path.join(processCwd, "..", "MonApp"),
    outputPath: process.env.OUTPUT_PATH || path.join(processCwd, "..", "MonApp", "runtime"),
    projectPath: process.env.PROJECT_PATH || path.join(processCwd, "..", "IIC-Data")
};

const config = rc(packageJson.name, baseConfig);

module.exports = config;