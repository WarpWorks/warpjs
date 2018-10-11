const debug = require('debug')('W2:portal:resources/working-for-by-user');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const routes = require('./../../../lib/constants/routes');

module.exports = async (persistence, userEntity, userInstance) => {
    const relationship = userEntity.getRelationshipByName('WorkingFor');
    const companies = await relationship.getDocuments(persistence, userInstance);
    return companies.map((company) => {
        debug(`company=`, company);
        const href = RoutesInfo.expand(routes.portal.entity, company);
        const resource = warpjsUtils.createResource(href, {
            type: company.type,
            id: company.id,
            name: company.Name,
            label: company.CompanyName || company.Name
        });
        return resource;
    });
};
