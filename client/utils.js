const Promise = require('bluebird');

function ensureHalHeader(settings) {
    if (!settings.headers) {
        settings.headers = {};
    }
    settings.headers.Accept = 'application/hal+json';

    if (!settings.dataType) {
        settings.dataType = 'json';
    }

    return settings;
}

function getCurrentPageHAL($, url = null) {
    return new Promise((resolve, reject) => {
        const defaultSettings = {
            method: 'GET',
            success(data, textStatus, jqXHR) {
                resolve({data, textStatus, jqXHR});
            },
            error(jqXHR, textStatus, errorThrown) {
                resolve({
                    error: {
                        textStatus,
                        errorThrown
                    },
                    data: jqXHR.responseJSON
                });
            }
        };

        if (url) {
            defaultSettings.url = url;
        }

        const settings = ensureHalHeader(defaultSettings);

        $.ajax(settings);
    });
}

module.exports = {
    ensureHalHeader,
    getCurrentPageHAL
};
