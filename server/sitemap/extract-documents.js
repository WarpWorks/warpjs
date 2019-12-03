const Promise = require('bluebird');

const Document = require('./../../lib/core/first-class/document');
// const Documents = require('./../../lib/core/first-class/documents');

const { PRIORITY } = require('./constants');
const convertTime = require('./convert-time');
const debug = require('./debug')('extract-document');

let subEntities;

const extractDocuments = async (persistence, domain, document, level = 1, stop = false, cumulator = []) => {
    // debug(`document=${document.type}/${document.id}/${document.Status}, level=${level}, stop=${stop}`);

    if (!subEntities) {
        const contentEntity = domain.getEntityByName('Content'); // FIXME: Hard-coded.
        subEntities = contentEntity.getChildEntities(true, true)
            .filter((e) => !e.isAbstract)
            .filter((e) => e.getPageViews().filter((pv) => pv.name !== 'DefaultPageView').length)
            .map((e) => e.name)
        ;
    }

    const entity = domain.getEntityByInstance(document);

    const bestDocument = await Document.bestDocument(persistence, entity, document);
    if (bestDocument.id !== document.id) {
        return cumulator;
    }

    // FIXME: What are the rules to keep the document?
    //  - Status?
    const isVisible = await Document.isVisible(persistence, entity, document);
    const isSubEntityOfContent = subEntities.indexOf(document.type) !== -1;

    if (isVisible && isSubEntityOfContent) {
        let lastmod;
        try {
            lastmod = convertTime(document.lastUpdated);
        } catch (err) {
            debug(`Invalid lastUpdated=${document.lastUpdated} for ${document.type}/${document.id}`);
        }

        cumulator.push({
            lastmod,
            priority: PRIORITY[level] || PRIORITY.DEFAULT,
            loc: await Document.getPortalUrl(persistence, entity, document)
        });
    }

    // TODO: Get images?

    if (stop) {
        return cumulator;
    }

    const nextStop = Boolean(document.ReleaseableContent);

    const aggregationRelationships = entity.getRelationships().filter((reln) => {
        if (reln.isAggregation) {
            const targetEntity = reln.getTargetEntity();
            if (targetEntity) {
                return targetEntity.isDocument();
            } else {
                // eslint-disable-next-line no-console
                console.error(`Relationship '${entity.name}/${reln.id}/${reln.name}' doesn't have a target entity.`);
                return false;
            }
        }
    });
    // debug(`    found ${aggregationRelationships.length} aggregation relationships.`);

    return Promise.reduce(
        aggregationRelationships,
        async (cumulator, aggregationRelationship) => {
            // debug(`      - relationship=${aggregationRelationship.name}`);
            const aggregationDocuments = await aggregationRelationship.getDocuments(persistence, document);
            // const bestDocuments = await Documents.bestDocuments(persistence, domain, aggregationDocuments); // FIXME: Too long for Users
            return Promise.reduce(
                aggregationDocuments,
                // bestDocuments,
                async (cumulator, aggregationDocument) => cumulator.concat(await extractDocuments(persistence, domain, aggregationDocument, level + 1, nextStop)),
                cumulator,
                { concurrency: 1 }
            );
        },
        cumulator,
        { concurrency: 1 }
    );
};

module.exports = extractDocuments;
