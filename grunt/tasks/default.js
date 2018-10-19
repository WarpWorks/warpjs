module.exports = (grunt) => {
    grunt.registerTask('default', [
        'clean',
        'eslint',
        'jscpd',
        'copy',
        'less',
        'webpack'
    ]);
};
