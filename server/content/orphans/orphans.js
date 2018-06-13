const ComplexTypes = require('./../../../lib/core/complex-types');
const Orphan = require('./../../edition/orphan');
const { routes } = require('./../constants');

class Orphans {
    constructor(domainModel, documents) {
        this.domainModel = domainModel;
        this.orphans = [];

        this.addOrphansByType(documents);
        this.addOrphansByParent(documents);
        this.addOrphansByRelationship(documents);
    }

    isOrphan(document) {
        return Boolean(this.orphans.find((orphan) => orphan.id === document.id));
    }

    nonOrphans(documents) {
        return documents.filter((document) => !this.isOrphan(document));
    }

    get length() {
        return this.orphans.length;
    }

    addOrphans(reason, documents) {
        documents.forEach((document) => this.orphans.push(new Orphan(reason, document)));
    }

    addOrphansByType(documents) {
        const cache = this.domainModel.getEntities().map((entity) => entity.name);

        const newOrphans = this.nonOrphans(documents).filter((document) => cache.indexOf(document.type) === -1);

        this.addOrphans(Orphan.REASONS.MISSING_ENTITY, newOrphans);
    }

    addOrphansByParent(documents) {
        const cache = documents.map((document) => document.id);

        const newOrphans = this.nonOrphans(documents)
            .filter((document) => document.parentID ? (cache.indexOf(document.parentID) === -1) : false)
        ;

        this.addOrphans(Orphan.REASONS.MISSING_PARENT, newOrphans);
    }

    addOrphansByRelationship(documents) {
        const cache = this.domainModel.getAllElements()
            .filter((element) => element.type === ComplexTypes.Relationship)
            .map((element) => String(element.id))
        ;

        // Some old data as the ID as a string.
        const newOrphans = this.nonOrphans(documents)
            .filter((document) => document.parentRelnID ? (cache.indexOf(String(document.parentRelnID)) === -1) : false)
        ;

        this.addOrphans(Orphan.REASONS.MISSING_RELATIONSHIP, newOrphans);
    }

    toHAL() {
        return this.orphans.map((orphan) => orphan.toHAL(this.domainModel, routes));
    }
}

module.exports = Orphans;
