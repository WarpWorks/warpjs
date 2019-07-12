module.exports = (grunt) => {
    grunt.registerTask('build', [
        'clean',
        'copy',
        'less',
        'babel',
        'webpack'
    ]);
};
