const path = require('path');

module.exports = {
    core: require('./lib/core'),
    app: require('./server/app'),
    publicFolder: path.join(__dirname, 'public')
};
