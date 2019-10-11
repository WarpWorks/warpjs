const warpjsUtils = require('@warp-works/warpjs-utils');

const AggregationFilters = require('./../../../lib/core/first-class/aggregation-filters');
const utils = require('./../utils');
const serverUtils = require('./../../utils');

// const debug = require('./debug')('patch-filter');

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

        AggregationFilters.patchFilter(document, relationshipInstance.id, body.id, body.key, body.value);

        await entity.updateDocument(persistence, document);

        const aggregationFilters = AggregationFilters.getRelationshipFilter(document, relationshipInstance.id);
        resource.embed('aggregationFilters', aggregationFilters.entities);

        utils.sendHal(req, res, resource);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`*** ERROR *** aggregation-filters/patch-filter:`, err);
        utils.sendErrorHal(req, res, resource, err);
    } finally {
        persistence.close();
    }
};
