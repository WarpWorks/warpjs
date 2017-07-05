module.exports = () => {
    return {
        less: {
            options: {
                compress: true
            },
            files: [{
                dest: 'public/app/portal.min.css',
                src: 'client/portal/less/main.less'
            }]
        }
    };
};
