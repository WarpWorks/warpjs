// const debug = require('debug')('W2:studio:utils/send-hal');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsPlugins = require('@warp-works/warpjs-plugins');

const { routes } = require('./../constants');
const { menuItems, sendHal } = require('./../../utils');

module.exports = (req, res, resource, status) => {
    const { domain, type, id } = req.params;
    // debug(`(): domain=${domain}, type=${type}, id=${id}`);

    const menuPlugins = (domain)
        ? warpjsPlugins.getPlugins(['studio-domain-action', 'studio-action'])
        : warpjsPlugins.getPlugins('studio-action')
    ;

    // debug(`menuPlugins=`, menuPlugins);

    resource.embed('headerMenuItems', menuItems(menuPlugins, domain, type, id));

    resource.link('warpjsHome', RoutesInfo.expand(routes.home, {}));
    sendHal(req, res, resource, status);
};
