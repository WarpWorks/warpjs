const addBasicPropertyToBasicsPanel = require('./add-basic-property-to-basics-panel');
const addRelationshipToBasicsPanel = require('./add-relationship-to-basics-panel');
const ComplexTypes = require('./../complex-types');
const debug = require('./debug')('add-to-basic-panel');

const DEFAULT_PAGE_VIEW_NAME = 'DefaultPageView';

module.exports = async (DOMAIN, persistence, changeToMake) => {
    const warpCore = require('./../index');

    const coreDomain = await warpCore.getCoreDomain();

    const entityEntity = coreDomain.getEntityByName('Entity');
    const pageViewEntity = coreDomain.getEntityByName('PageView');

    const pageViewsRelationship = entityEntity.getRelationshipByName('pageViews');
    const panelRelationship = pageViewEntity.getRelationshipByName('panels');

    const entityDocuments = await entityEntity.getDocuments(persistence, { warpjsId: changeToMake.entityId });
    const entityDocument = entityDocuments && entityDocuments.length ? entityDocuments[0] : null;

    if (!entityDocument) {
        debug(`Cannot find entityDocument for name='${changeToMake.entityName}'.`);
        return;
    }

    const pageViewDocuments = await pageViewsRelationship.getDocuments(persistence, entityDocument);
    const defaultPageViewDocument = pageViewDocuments.find((pv) => pv.name === DEFAULT_PAGE_VIEW_NAME);
    if (!defaultPageViewDocument) {
        // DefaultPageView is not defined. Skip.
        debug(`no default page view.`);
        return;
    }

    const panelDocuments = await panelRelationship.getDocuments(persistence, defaultPageViewDocument);
    const basicsPanelDocument = panelDocuments.find((p) => p.name === 'Basic' || p.name === 'Basics');
    // debug(`basicsPanelDocument=`, basicsPanelDocument);
    if (!basicsPanelDocument) {
        debug(`addToBasicsPanel():   no BASIC panel.`);
        return;
    }
    basicsPanelDocument.embedded = basicsPanelDocument.embedded || [];

    const panelEntity = panelRelationship.getTargetEntity();

    let changed = false;

    if (changeToMake.type === ComplexTypes.BasicProperty) {
        changed = await addBasicPropertyToBasicsPanel(DOMAIN, persistence, changeToMake, panelEntity, basicsPanelDocument);
    } else if (changeToMake.type === ComplexTypes.Relationship) {
        changed = await addRelationshipToBasicsPanel(DOMAIN, persistence, changeToMake, panelEntity, basicsPanelDocument);
    } else {
        // eslint-disable-next-line no-console
        console.error(`Unknown changeToMake.type=${changeToMake.type}`);
    }

    if (changed) {
        await pageViewEntity.updateDocument(persistence, defaultPageViewDocument);
    }
};
