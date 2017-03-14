const fs = require('fs');
const path = require('path');
const rc = require('rc');

const packageJson = require('./../package.json');

// This logic make sure we are placed at the package.json level.
let processCwd = process.cwd();
while (processCwd !== '/') {
    if (fs.existsSync(path.join(processCwd, 'package.json'))) {
        break;
    }
    processCwd = path.dirname(processCwd);
}

const baseConfig = {
    port: process.env.PORT || "3001",
    serverStarted: (new Date()).toString(),
    mongoServer: process.env.MONGODB_HOST || 'localhost',
    projectPath: process.env.PROJECT_PATH || path.join(processCwd, '..', '..', 'IIC-Data'),
    public: process.env.PUBLIC_PATH || path.join(processCwd, '..', '..', 'IIC-Data', 'public')
};

const config = rc(packageJson.name, baseConfig);

delete config._;
delete config.config;
delete config.configs;

console.log("server/config: config=", config);

module.exports = config;
