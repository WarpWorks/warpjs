const aliases = require('./../../lib/core/first-class/aliases');
// const debug = require('./debug')('aliases');

module.exports = async (req, res, next) => {
    try {
        const originalUrl = req.originalUrl;
        const aliasInfo = await aliases.get(originalUrl);
        if (aliasInfo) {
            if (aliasInfo.url) {
                res.redirect(307, aliasInfo.url);
            } else {
                const extractInstance = require('./../portal/instance/extract-instance');
                await extractInstance(req, res, aliasInfo.type, aliasInfo.id, aliasInfo.view);
            }
        } else {
            // Did not find an alias, so just go on with the rest of the site.
            next();
        }
    } catch (err) {
        next(err);
    }
};
