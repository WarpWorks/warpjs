const fs = require('fs');
const path = require('path');

const generateSitemap = require('./generate-sitemap');

const serverUtils = require('./../utils');

const debug = require('./debug')('sitemap');

const config = serverUtils.getConfig();

const ACCEPTABLE_DELTA = 24 * 60 * 60 * 1000; // One day.

module.exports = async (req, res) => {
    const hrstart = process.hrtime();

    try {
        let content;
        let sendContent = true;

        const sitemapXML = path.resolve(path.join(config.public, 'sitemap.xml'));
        if (fs.existsSync(sitemapXML)) {
            content = fs.readFileSync(sitemapXML, { encoding: 'utf8' });
            res.status(200).set('Content-Type', 'application/xml').send(content).end();
            sendContent = false;

            const stat = fs.statSync(sitemapXML);

            const mtime = stat.mtimeMs;
            const now = (new Date()).getTime();
            const delta = now - mtime;

            if (delta < ACCEPTABLE_DELTA) {
                debug(`Skipping regeneration of sitemap.xml`);
                return;
            }
        }

        debug(`generating sitemap.xml`);
        content = await generateSitemap(req, res);
        fs.writeFileSync(sitemapXML, content);

        if (sendContent) {
            res.status(200).set('Content-Type', 'application/xml').send(content).end();
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`sitemap: *** ERROR *** err=`, err);
        res.status(500).send(err.message);
    } finally {
        const delta = process.hrtime(hrstart);
        debug(`Done generating sitemap.xml in ${delta[0]}s${delta[1] / 1000000}ms`);
    }
};
