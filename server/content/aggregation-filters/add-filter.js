const warpjsUtils = require('@warp-works/warpjs-utils');

const AggregationFilters = require('./../../../lib/core/first-class/aggregation-filters');
const utils = require('./../utils');
const serverUtils = require('./../../utils');

const debug = require('./debug')('add-filter');

module.exports = async (req, res) => {
    const { domain, type, id, relationship } = req.params;
    const { body } = req;

    const resource = warpjsUtils.createResource(
        req,
        {
            domain,
            type,
            id,
            relationship,
            body,
            description: "Adding an aggregation filter."
        },
        req
    );

    const persistence = serverUtils.getPersistence(domain);

    try {
        const entity = await serverUtils.getEntity(domain, type);
        const document = await entity.getInstance(persistence, id);
        if (!document.id) {
            throw new Error(`Invalid document ${domain}/${type}/${id}.`);
        }
        const relationshipInstance = entity.getRelationshipByName(relationship);

        AggregationFilters.addFilter(document, relationshipInstance.id, body.id);

        await entity.updateDocument(persistence, document);
        debug(`document before save:`, JSON.stringify(document._meta.aggregationFilters, null, 2));

        utils.sendHal(req, res, resource);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`*** ERROR *** aggregation-filters/add-filters:`, err);
        utils.sendErrorHal(req, res, resource, err);
    } finally {
        persistence.close();
    }
};
