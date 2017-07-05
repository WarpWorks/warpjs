module.exports = (grunt) => {
    grunt.registerTask('default', [
        'clean',
        'eslint',
        'copy',
        'less',
        'webpack'
    ]);
};
