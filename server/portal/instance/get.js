const extractInstance = require('./extract-instance');
const serverUtils = require('./../../utils');

const config = serverUtils.getConfig();

module.exports = async (req, res) => {
    const { type, id } = req.params;
    const pageViewName = req.query.pageViewName || config.views.portal;

    await extractInstance(req, res, type, id, pageViewName);
};
