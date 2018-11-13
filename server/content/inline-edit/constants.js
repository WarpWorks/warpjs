const { isOfHeadingLevel } = require('./../../portal/resources/constants');
const routes = require('./../../../lib/constants/routes');

module.exports = Object.freeze({
    ACTIONS: Object.freeze({
        LIST_TYPES: 'list-types'
    }),
    routes: routes,
    isOfHeadingLevel
});
