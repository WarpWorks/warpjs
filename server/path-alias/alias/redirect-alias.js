const aliases = require('./../../../lib/core/first-class/aliases');
// const debug = require('./debug')('redirect-alias');

module.exports = async (req, res) => {
    const { alias } = req.params;

    const aliasInfo = await aliases.get(alias);

    if (aliasInfo) {
        if (aliasInfo.url) {
            // Sending 307 because this path may change, so we want the user to
            // come back and double check next time.
            res.redirect(307, aliasInfo.url);
        } else {
            const extractInstance = require('./../../portal/instance/extract-instance');
            await extractInstance(req, res, aliasInfo.type, aliasInfo.id, aliasInfo.view);
        }
    } else {
        res.status(404).send();
    }
};
