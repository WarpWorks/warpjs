const path = require('path');

const warpjsUtilsAssetsFolder = path.join(path.dirname(require.resolve('@warp-works/warpjs-utils/package.json')), 'assets');

module.exports = {
    warpjsUtils: {
        files: [{
            expand: true,
            flatten: false,
            dest: 'public/3rd-party',
            cwd: path.join(warpjsUtilsAssetsFolder),
            src: [
                '**'
            ]
        }]
    },

    tinymce: {
        files: [{
            expand: true,
            dest: 'public/3rd-party/js',
            flatten: true,
            src: [
                'node_modules/tinymce/tinymce*'
            ]
        }, {
            expand: true,
            dest: 'public/3rd-party/js/themes/modern',
            flatten: true,
            src: [
                'node_modules/tinymce/themes/modern/*.js'
            ]
        }, {
            expand: true,
            dest: 'public/3rd-party/js/',
            flatten: false,
            cwd: 'node_modules/tinymce',
            src: [
                'skins/**/*',
                'themes/**/*',
                'plugins/**/*'
            ]
        }]
    }
};
