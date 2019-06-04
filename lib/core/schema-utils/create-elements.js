const Promise = require('bluebird');

const createElement = require('./create-element');

module.exports = async (DOMAIN, persistence, changesToMake) => {
    await Promise.each(
        changesToMake,
        async (changeToMake) => createElement(DOMAIN, persistence, changeToMake)
    );
};
