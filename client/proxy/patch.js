const _ = require('lodash');
const Promise = require('bluebird');

const basicAjaxOptions = require('./basic-ajax-options');

module.exports = ($, url, data) => Promise.resolve()
    .then(() => $.ajax(_.extend({}, basicAjaxOptions, {
        method: 'PATCH',
        url,
        data
    })))
;
