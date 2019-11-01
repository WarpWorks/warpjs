const Promise = require('bluebird');

const Document = require('./../../lib/core/first-class/document');
// const Documents = require('./../../lib/core/first-class/documents');

const { PRIORITY } = require('./constants');
const debug = require('./debug')('extract-document');

let subEntities;

const extractDocuments = async (persistence, domain, document, level = 1, stop = false, cumulator = []) => {
    // debug(`document=${document.type}/${document.id}/${document.Status}, level=${level}, stop=${stop}`);

    if (!subEntities) {
        const contentEntity = domain.getEntityByName('Content'); // FIXME: Hard-coded.
        subEntities = contentEntity.getChildEntities(true, true).filter((e) => !e.isAbstract).map((e) => e.name);
    }

    const entity = domain.getEntityByInstance(document);

    if (level === 3) {
        return cumulator;
    }

    // FIXME: What are the rules to keep the document?
    //  - Status?
    const statusBasicProperty = entity.getBasicPropertyByName('Status');
    const isVisible = await Document.isVisible(persistence, entity, document);
    if ((statusBasicProperty || level === 1 || level === 2) && isVisible && (subEntities.indexOf(document.type) !== -1)) {
        debug(`    isVisible`);

        let lastmod;
        try {
            lastmod = (new Date(document.lastUpdated)).toISOString().replace(/T.*/, '');
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
        debug(`    stop!!!`);
        return cumulator;
    }

    const nextStop = Boolean(document.ReleaseableContent);

    const aggregationRelationships = entity.getRelationships().filter((reln) => reln.isAggregation && reln.getTargetEntity().isDocument());
    debug(`    found ${aggregationRelationships.length} aggregation relationships.`);

    return Promise.reduce(
        aggregationRelationships,
        async (cumulator, aggregationRelationship) => {
            debug(`      - relationship=${aggregationRelationship.name}`);
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
