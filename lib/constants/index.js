const path = require('path');

const actions = require('./actions');

const PROJECT_ROOT = path.dirname(require.resolve('./../../package.json'));

const constants = {
    CORE: {
        DOMAIN: 'WarpJS',
        FILE: path.join(PROJECT_ROOT, 'schema', 'WarpWorks.jsn')
    },
    actions
};

Object.freeze(constants);

module.exports = constants;
