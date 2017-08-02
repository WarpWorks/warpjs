module.exports = {
    "bootstrap": {
        files: [{
            expand: true,
            dest: 'public/3rd-party/js',
            flatten: true,
            src: [
                'node_modules/bootstrap/dist/js/bootstrap*'
            ]
        }, {
            expand: true,
            dest: 'public/3rd-party/css',
            flatten: true,
            src: [
                'node_modules/bootstrap/dist/css/bootstrap*'
            ]
        }, {
            expand: true,
            dest: 'public/3rd-party/fonts',
            flatten: true,
            src: [
                'node_modules/bootstrap/fonts/*'
            ]
        }]
    },
    "jquery": {
        files: [{
            expand: true,
            dest: 'public/3rd-party/js',
            flatten: true,
            src: [
                'node_modules/jquery/dist/jquery*'
            ]
        }]
    },
    'font-awesome': {
        files: [{
            expand: true,
            dest: 'public/3rd-party/css',
            flatten: true,
            src: [
                'node_modules/font-awesome/css/font-awesome.*'
            ]
        }, {
            expand: true,
            dest: 'public/3rd-party/fonts',
            flatten: true,
            src: [
                'node_modules/font-awesome/fonts/*'
            ]
        }]
    },

    'tinymce': {
        files: [{
            expand: true,
            dest: 'public/3rd-party/js',
            flatten: true,
            src: [
                'node_modules/tinymce/tinymce*'
            ]
        }]
    }
};
