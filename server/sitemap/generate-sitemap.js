const extend = require('lodash/extend');
const nanositemap = require('nanositemap');
// const xml2js = require('xml2js');

// const warpjsUtils = require('@warp-works/warpjs-utils');

const aliases = require('./../../lib/core/first-class/aliases');
const Documents = require('./../../lib/core/first-class/documents');
const serverUtils = require('./../utils');

const convertTime = require('./convert-time');
// const debug = require('./debug')('generate-sitemap');
const extractDocuments = require('./extract-documents');

module.exports = async (req, res) => {
    const persistence = serverUtils.getPersistence();

    try {
        const rootEntity = await serverUtils.getRootEntity();
        const domain = rootEntity.getDomain();

        const rootDocs = await rootEntity.getDocuments(persistence);
        const bestDocuments = await Documents.bestDocuments(persistence, domain, rootDocs);
        const homepageDocument = bestDocuments[0];

        const documents = await extractDocuments(persistence, domain, homepageDocument);

        const aliasedDocuments = await aliases.getAll(persistence);

        aliasedDocuments.forEach((aliasedDocument) => {
            const foundAlias = documents.find((doc) => doc.loc === aliasedDocument.url);
            if (foundAlias) {
                foundAlias.priority = (foundAlias.priority === '1.0') ? '1.0' : '0.8';
            } else {
                documents.push({
                    lastmod: convertTime(aliasedDocument.lastUpdated),
                    loc: aliasedDocument.url,
                    priority: '0.8'
                });
            }
        });

        const urlPrefix = `${req.protocol}://${req.get('host')}`;
        return nanositemap(urlPrefix, documents.reduce(
            (map, doc) => extend(map, {
                [doc.loc]: {
                    lastmod: doc.lastmod,
                    priority: doc.priority
                }
            }),
            {}
        ));

        // const urls = documents.filter((d) => d).map((doc) => ({ url: { ...doc, loc: warpjsUtils.fullUrl(req, doc.loc) } }));

        // const xmlObj = {
        //     urlset: {
        //         $: {
        //             'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        //             'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1'
        //         },
        //         _: urls
        //     }
        // };
        // const builder = new xml2js.Builder();
        // return builder.buildObject(xmlObj);

        // const builder = new xml2js.Builder({
        //     rootName: 'urlset',
        //     $: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' }
        // });
        // return builder.buildObject(urls);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`sitemap: *** ERROR: err=`, err);
        return "ERR";
    } finally {
        persistence.close();
    }
};
