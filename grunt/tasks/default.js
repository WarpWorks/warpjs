module.exports = (grunt) => {
    grunt.registerTask('default', [
        'clean',
        'eslint',
        'jscpd',
        'copy',
        'less',
        'babel',
        'webpack'
    ]);
};
