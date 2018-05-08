const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const utils = require('./../utils');

module.exports = (req, res) => {
    const domainsUrl = RoutesInfo.expand(constants.routes.domains, {});

    res.format({
        html() {
            res.redirect(domainsUrl);
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const resource = warpjsUtils.createResource(req, {
                title: "WarpJS content home",
                redirect: domainsUrl
            });

            utils.sendHal(req, res, resource);
        }
    });
};
