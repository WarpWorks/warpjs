const path = require('path');

const packageJson = require('./package.json');

module.exports = {
    core: require('./lib/core'),
    app: require('./server/app'),
    publicFolder: path.join(__dirname, 'public'),
    version: packageJson.version
};
