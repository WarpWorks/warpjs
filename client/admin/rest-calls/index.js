const getDomainData = require('./get-domain-data');
const postDomainData = require('./post-domain-data');
const generateDefaultViews = require('./generate-default-views');
const createDefaultViews = require('./create-default-views');
const generateTestData = require('./generate-test-data');
const removeTestData = require('./remove-test-data');

module.exports = {
    getDomainData,
    postDomainData,
    generateDefaultViews,
    createDefaultViews,
    generateTestData,
    removeTestData
};
