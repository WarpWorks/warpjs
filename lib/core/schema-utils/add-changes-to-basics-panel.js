const Promise = require('bluebird');

const addToBasicsPanel = require('./add-to-basics-panel');

module.exports = async (DOMAIN, persistence, changesToMake) => Promise.each(
    changesToMake,
    async (changeToMake) => addToBasicsPanel(DOMAIN, persistence, changeToMake)
);
