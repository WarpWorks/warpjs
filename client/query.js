const Promise = require('bluebird');

module.exports = ($, method, data, url) => {
    const ajaxOptions = {
        url,
        method,
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json'
    };

    return Promise.resolve($.ajax(ajaxOptions));
};
