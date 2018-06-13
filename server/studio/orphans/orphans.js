const Orphan = require('./../../edition/orphan');
const { routes } = require('./../constants');

class Orphans {
    constructor(domainInstance) {
        this.domainInstance = domainInstance;
        this.orphans = [];

        this.validOIDs = this.domainInstance.getAllElements().map((element) => element.id);

        this.findInvalidReferences();
    }

    addOrphan(reason, element, details) {
        this.orphans.push(new Orphan(reason, element, details));
    }

    isInvalid(oid) {
        return (oid !== null) && (this.validOIDs.indexOf(oid) === -1);
    }

    // FIXME: This logic is the same as in domain.replaceOIDs().
    findInvalidReferences() {
        this.domainInstance.getEntities().forEach((entity) => {
            // parentClass
            if (entity.hasParentClass()) {
                const oid = entity.hasParentClass() ? entity.getParentClass() : null;
                if (this.isInvalid(oid)) {
                    this.addOrphan(Orphan.REASONS.INVALID_PARENT_CLASS, entity);
                }
            }

            // relationship's targetEntity
            entity.relationships.forEach((reln) => {
                const oid = reln.targetEntity && reln.targetEntity.length ? reln.targetEntity[0] : null;
                if (this.isInvalid(oid)) {
                    this.addOrphan(Orphan.REASONS.INVALID_TARGET_ENTITY, entity, reln.name);
                }
            });

            // TableView
            entity.tableViews.forEach((tableView) => {
                tableView.tableItems.forEach((tableItem) => {
                    // TableItem property
                    const oid = tableItem.hasProperty() ? tableItem.getProperty() : null;
                    if (this.isInvalid(oid)) {
                        this.addOrphan(Orphan.REASONS.INVALID_TABLEVIEW_PROPERTY, tableView, tableItem.name);
                    }
                });
            });

            // PageView
            entity.pageViews.forEach((pageView) => {
                // Panel
                pageView.panels.forEach((panel) => {
                    // BasicProperty
                    panel.basicPropertyPanelItems.forEach((panelItem) => {
                        const oid = panelItem.hasBasicProperty() ? panelItem.getBasicProperty() : null;
                        if (this.isInvalid(oid)) {
                            this.addOrphan(Orphan.REASONS.INVALID_PAGEVIEW_BASIC_PROPERTY, pageView, `${panel.name}.${panelItem.name}`);
                        }
                    });

                    // Relationship
                    panel.relationshipPanelItems.forEach((panelItem) => {
                        const oid = panelItem.hasRelationship() ? panelItem.getRelationship() : null;
                        if (this.isInvalid(oid)) {
                            this.addOrphan(Orphan.REASONS.INVALID_PAGEVIEW_RELATIONSHIP, pageView, `${panel.name}.${panelItem.name}`);
                        }
                    });

                    // Enumeration
                    panel.enumPanelItems.forEach((panelItem) => {
                        const oid = panelItem.hasEnumeration() ? panelItem.getEnumeration() : null;
                        if (this.isInvalid(oid)) {
                            this.addOrphan(Orphan.REASONS.INVALID_PAGEVIEW_ENUMERATION, pageView, `${panel.name}.${panelItem.name}`);
                        }
                    });
                });
            });
        });
    }

    toHAL() {
        return this.orphans.map((orphan) => orphan.toHAL(this.domainInstance, routes));
    }
}

module.exports = Orphans;
