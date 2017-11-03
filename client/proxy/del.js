const _ = require('lodash');
const Promise = require('bluebird');

const basicAjaxOptions = require('./basic-ajax-options');

module.exports = ($, url, data) => Promise.resolve()
    .then(() => $.ajax(_.extend({}, basicAjaxOptions, {
        method: 'DELETE',
        url,
        data: data && JSON.stringify(data, null, 2)
    })))
;
