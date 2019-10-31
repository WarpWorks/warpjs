const Promise = require('bluebird');
const xml2js = require('xml2js');
// const nanositemap = require('nanositemap');

const warpjsUtils = require('@warp-works/warpjs-utils');

const Document = require('./../lib/core/first-class/document');
const Documents = require('./../lib/core/first-class/documents');

const debug = require('./debug')('sitemap');
const serverUtils = require('./utils');

const PRIORITY = {
    1: '1.0',
    2: '0.8',
    3: '0.6',
    4: '0.4',
    5: '0.2',
    DEFAULT: '0.1'
};

let counter = 0;

const extractDocuments = async (persistence, domain, document, level=1, stop=false, cumulator=[]) => {
    counter += 1;

    debug(`extractDocuments(): document=${document.type}/${document.id}/${document.Status}, level=${level}, stop=${stop}`);

    const entity = domain.getEntityByInstance(document);

    if (level === 3) {
        return cumulator;
    }

    // FIXME: What are the rules to keep the document?
    //  - Status?
    const statusBasicProperty = entity.getBasicPropertyByName('Status');
    const isVisible = await Document.isVisible(persistence, entity, document);
    if ((statusBasicProperty || level === 1 || level === 2) && isVisible) {
        debug(`extractDocuments():     isVisible`);

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
        debug(`extractDocuments():     stop!!!`);
        return cumulator;
    }

    const nextStop = Boolean(document.ReleaseableContent);

    const aggregationRelationships = entity.getRelationships().filter((reln) => reln.isAggregation && reln.getTargetEntity().isDocument());
    debug(`extractDocuments():     found ${aggregationRelationships.length} aggregation relationships.`);

    return Promise.reduce(
        aggregationRelationships,
        async (cumulator, aggregationRelationship) => {
            debug(`extractDocuments():       - relationship=${aggregationRelationship.name}`);
            const aggregationDocuments = await aggregationRelationship.getDocuments(persistence, document);
            // const bestDocuments = await Documents.bestDocuments(persistence, domain, aggregationDocuments); // FIXME: Too long for Users
            return Promise.reduce(
                aggregationDocuments,
                // bestDocuments,
                async (cumulator, aggregationDocument) => cumulator.concat(await extractDocuments(persistence, domain, aggregationDocument, level+1, nextStop)),
                cumulator,
                { concurrency: 1 }
            );
        },
        cumulator,
        { concurrency: 1 }
    );
};

const generateSitemap = async (req, res) => {
    const persistence = serverUtils.getPersistence();

    try {
        const rootEntity = await serverUtils.getRootEntity();
        const domain = rootEntity.getDomain();

        const rootDocs = await rootEntity.getDocuments(persistence);
        const bestDocuments = await Documents.bestDocuments(persistence, domain, rootDocs);
        const homepageDocument = bestDocuments[0];

        const documents = await extractDocuments(persistence, domain, homepageDocument);
        const urls = documents.filter((d) => d).map((doc) => ({ url: { ...doc, loc: warpjsUtils.fullUrl(req, doc.loc) }}));

        // const host = req.get('host');
        // return nanositemap(`http://${host}`, documents.reduce(
        //     (map, doc) => {
        //         map[doc.loc] = {
        //             lastmod: doc.lastmod,
        //             priority: doc.priority
        //         };
        //         return map;
        //     },
        //     {}
        // ));

        const xmlObj = {
            urlset: {
                $: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
                _: urls
            }
        };
        const builder = new xml2js.Builder();
        return builder.buildObject(xmlObj);

        // const builder = new xml2js.Builder({
        //     rootName: 'urlset',
        //     $: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' }
        // });
        // return builder.buildObject(urls);

    } catch (err) {
        console.error(`sitemap: *** ERROR: err=`, err);
        return "ERR";
    } finally {
        persistence.close();
    }
};

module.exports = async (req, res) => {
    debug(`starting...`);
    counter = 0;
    try {
        const content = await generateSitemap(req, res);
        res.status(200).set('Content-Type', 'application/xml').send(content);
    } catch (err) {
        console.error(`sitemap: *** ERROR *** err=`, err);
        res.status(500).send(err.message);
    } finally {
        debug(`counter=${counter}`);
    }
};
