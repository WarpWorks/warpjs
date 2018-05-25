const Promise = require('bluebird');

const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    const { domain } = req.params;

    return Promise.resolve()
        .then(() => serverUtils.getDomain(domain))
        .then((domainModel) => domainModel.toJSON())
        .then((json) => {
            res.set('Content-Disposition', `inline; filename="${domain}.json"`);
            res.json(json);
        })
    ;
};
