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

function getCurrentPageHAL($) {
    return new Promise((resolve, reject) => {
        const settings = ensureHalHeader({
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
        });

        $.ajax(settings);
    });
}

module.exports = {
    ensureHalHeader,
    getCurrentPageHAL
};
