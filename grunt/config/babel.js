module.exports = {
    options: {
        sourceMap: false,
        presets: [ 'env', 'react' ]
    },
    ssr: {
        files: [
            {
                expand: true,
                cwd: 'server/portal/entity-html/components',
                src: [ '*.jsx', '*.js' ],
                dest: 'server/portal/entity-html/ssr/',
                ext: '.js'
            }
        ]
    }
};
