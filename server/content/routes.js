const RoutesInfo = require('@quoin/expressjs-routes-info');

const { routes } = require('./constants');
const domain = require('./domain');
const domains = require('./domains');
const domainType = require('./domain-type');
const domainTypes = require('./domain-types');
const entitySibling = require('./entity-sibling');
const fileUpload = require('./../edition/file-upload');
const home = require('./home');
const inlineEdit = require('./inline-edit');
const inlineEditAssociation = require('./inline-edit-association');
const instanceRelationshipItem = require('./instance-relationship-item');
const inlineEditAssociationReorder = require('./inline-edit-association-reorder');
const instances = require('./instances');
const instance = require('./instance');
const instanceHistory = require('./instance-history');
const instanceRelationship = require('./instance-relationship');
const orphans = require('./orphans');

const ROUTE_OPTIONS = {
    allowPatch: 'application/json'
};

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route(routes.home, '/', home);
    routesInfo.route(routes.domains, '/domain', domains);
    routesInfo.route(routes.domain, '/domain/{domain}', domain);
    routesInfo.route(routes.fileUpload, '/domain/{domain}/file-upload', fileUpload);
    routesInfo.route(routes.orphans, '/domain/{domain}/orphans', orphans);
    routesInfo.route(routes.entities, '/domain/{domain}/type{?profile}', domainTypes);
    routesInfo.route(routes.entity, '/domain/{domain}/type/{type}{?profile}', domainType);
    routesInfo.route(routes.instances, '/domain/{domain}/type/{type}/instance', instances);
    routesInfo.route(routes.instance, '/domain/{domain}/type/{type}/instance/{id}', instance, ROUTE_OPTIONS);
    routesInfo.route(routes.history, '/domain/{domain}/type/{type}/instance/{id}/history', instanceHistory);
    routesInfo.route(routes.sibling, '/domain/{domain}/type/{type}/instance/{id}/sibling', entitySibling);
    routesInfo.route(routes.relationship, '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}', instanceRelationship, ROUTE_OPTIONS);
    routesInfo.route(routes.instanceRelationshipItem, '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}/items/{itemId}', instanceRelationshipItem, ROUTE_OPTIONS);
    routesInfo.route(routes.relationshipPage, '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}/page/{page}', instance);

    routesInfo.route(routes.inlineEdit, '/domain/{domain}/type/{type}/instance/{id}/inline-edit{?view}', inlineEdit);
    routesInfo.route(routes.inlineEditAssociation, '/domain/{domain}/type/{type}/instance/{id}/inline-edit/associations/{name}', inlineEditAssociation);
    routesInfo.route(routes.inlineEditAssociationReorder, '/domain/{domain}/type/{type}/instance/{id}/inline-edit/associations/{name}/reorder', inlineEditAssociationReorder, ROUTE_OPTIONS);

    return routesInfo;
};
