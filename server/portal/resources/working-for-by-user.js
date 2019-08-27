const Promise = require('bluebird');

const warpjsUtils = require('@warp-works/warpjs-utils');

const Document = require('./../../../lib/core/first-class/document');
const Documents = require('./../../../lib/core/first-class/documents');

// const debug = require('./debug')('working-for-by-user');

module.exports = async (persistence, userEntity, userInstance) => {
    const relationship = userEntity.getRelationshipByName('WorkingFor');
    const companies = await relationship.getDocuments(persistence, userInstance);
    const domain = userEntity.getDomain();
    const bestDocuments = await Documents.bestDocuments(persistence, domain, companies);

    return Promise.map(
        bestDocuments,
        async (company) => {
            // debug(`company=`, company);
            const href = await Document.getPortalUrl(persistence, domain.getEntityByInstance(company), company);
            const resource = warpjsUtils.createResource(href, {
                type: company.type,
                id: company.id,
                name: company.Name,
                label: company.CompanyName || company.Name
            });
            return resource;
        }
    );
};
