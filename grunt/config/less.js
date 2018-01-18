const constants = require('./../../server/edition/constants');

module.exports = {
    options: {
        compress: true
    },

    edition: {
        dest: `public/app/${constants.assets.css}`,
        src: 'client/edition/style.less'
    },

    portal: {
        files: [{
            dest: 'public/app/warpjs.min.css',
            src: 'client/portal/less/main.less'
        }]
    }
};
