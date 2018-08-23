// const debug = require('debug')('W2:content:inline-edit/extract-data-paragraphs');
const Promise = require('bluebird');
// const warpjsUtils = require('@warp-works/warpjs-utils');

const overview = require('./resources/overview');
const pageViewResource = require('./resources/page-view');
const serverUtils = require('./../../utils');

module.exports = (req, persistence, entity, instance) => {
    const { view } = req.query;
    const { body } = req;

    const config = serverUtils.getConfig();
    const pageViewName = view || config.views.portal;

    return Promise.resolve()
        .then(() => overview(persistence, entity.getRelationshipByName('Overview'), instance))
        .then((items) => Promise.resolve()
            .then(() => entity.getPageView(pageViewName))
            .then((pageView) => pageViewResource(persistence, pageView, instance))
            .then((pageViewItems) => items.concat(pageViewItems))
        )
        .then((items) => items.filter((item) => item.type === body.elementType || (item.type === 'Paragraph' && body.elementType === 'Document')))
    ;
};
