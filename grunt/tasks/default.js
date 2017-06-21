module.exports = (grunt) => {
    grunt.registerTask('default', [
        'clean',
        'eslint',
        'webpack',
        'copy'
    ]);
};
