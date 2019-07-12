module.exports = (grunt) => {
    grunt.registerTask('default', [
        'eslint',
        'jscpd',
        'build'
    ]);
};
