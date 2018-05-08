module.exports = {
    reset($, element) {
        return $(element).closest('.form-group').removeClass('has-warning has-error has-success');
    },

    start($, element) {
        this.reset($, element).addClass('has-warning');
    },

    success($, element) {
        this.reset($, element).addClass('has-success');
    },

    error($, element) {
        this.reset($, element).addClass('has-error');
    }
};
