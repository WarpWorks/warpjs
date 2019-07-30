const path = require('path');

const actions = require('./actions');

const PROJECT_ROOT = path.dirname(require.resolve('./../../package.json'));

module.exports = Object.freeze({
    CORE: {
        DOMAIN: 'WarpJS',
        FILE: path.join(PROJECT_ROOT, 'schema', 'WarpWorks.jsn')
    },
    DEFAULT_VERSION: "1.0",
    actions
});
