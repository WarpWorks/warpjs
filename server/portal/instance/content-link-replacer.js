const RoutesInfo = require('@quoin/expressjs-routes-info');

module.exports = (match, label, type, id) => {
    const href = RoutesInfo.expand('entity', {id, type});
    const previewUrl = RoutesInfo.expand('W2:portal:preview', {id, type});
    return `<a href="${href}" data-warpjs-action="preview" data-warpjs-preview-url="${previewUrl}">${label}<span class="glyphicon glyphicon-link"></span></a>`;
};
