module.exports = {
    default: {
        src: [
            'dist'
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
    nyc: {
        src: [
            '.nyc_output'
        ]
    }
};
