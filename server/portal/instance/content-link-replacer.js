const RoutesInfo = require('@quoin/expressjs-routes-info');

module.exports = (match, label, type, id) => {
    const href = RoutesInfo.expand('entity', {id, type});
    return `<a href="${href}">${label}<span class="glyphicon glyphicon-link"></span></a>`;
};
