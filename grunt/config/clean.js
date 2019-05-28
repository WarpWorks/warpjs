const packageJson = require('./../../package.json');

module.exports = {
    default: {
        src: [
            'dist',
            'public/3rd-party',
            'public/app'
        ]
    },
    test: {
        src: [
            'reports'
        ]
    },
    public: {
        src: [
            'public/app/*.js.map',
            'public/app/content.js',
            'public/app/vendor.js',
            'public/libs/fonts',
            'public/libs/bootstrap/bootstrap*.css',
            'public/libs/bootstrap/bootstrap*.map'
        ]
    },
    ssr: {
        src: [
            'server/portal/entity-html/ssr'
        ]
    },
    nyc: {
        src: [
            '.nyc_output'
        ]
    },
    pack: {
        src: [
            `${packageJson.name.replace('@', '').replace('/', '-')}-*.tgz`
        ]
    }
};
