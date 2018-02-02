module.exports = {
    options: {
        compress: true
    },

    content: {
        dest: 'public/app/warpjs-edition.min.css',
        src: 'client/content/style.less'
    },

    portal: {
        files: [{
            dest: 'public/app/warpjs.min.css',
            src: 'client/portal/less/main.less'
        }]
    }
};
