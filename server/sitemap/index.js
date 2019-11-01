const generateSitemap = require('./generate-sitemap');

const debug = require('./debug')('sitemap');

module.exports = async (req, res) => {
    debug(`starting...`);
    try {
        const content = await generateSitemap(req, res);
        res.status(200).set('Content-Type', 'application/xml').send(content);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`sitemap: *** ERROR *** err=`, err);
        res.status(500).send(err.message);
    }
};
