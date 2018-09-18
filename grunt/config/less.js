const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../../server/edition/constants');

module.exports = {
    options: {
        compress: true,
        paths: [
            warpjsUtils.stylePath
        ]
    },

    edition: {
        dest: `public/app/${constants.assets.css}`,
        src: 'client/edition/style.less'
    },

    portal: {
        files: [{
            dest: 'public/app/warpjs.min.css',
            src: 'client/portal/instance/style.less'
        }]
    }
};
