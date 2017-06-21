module.exports = {
    bootstrap: {
        files: [{
            expand: true,
            dest: 'public/libs/bootstrap',
            flatten: true,
            src: [
                'node_modules/bootstrap/dist/css/bootstrap*'
            ]
        }, {
            expand: true,
            dest: 'public/libs/fonts',
            flatten: true,
            src: [
                'node_modules/bootstrap/dist/fonts/glyphicons*'
            ]
        }]
    }
};
