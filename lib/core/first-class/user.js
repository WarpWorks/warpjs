const cloneDeep = require('lodash/cloneDeep');

const core = require('./../');
// const debug = require('./debug')('user');

const ENTITY_NAME = 'User';
const FOLLOW_RELATIONSHIP_NAME = 'Follows';
let userEntity;

class User {
    constructor(entity, userDocument) {
        this.entity = entity;
        this.userDocument = cloneDeep(userDocument || {});
    }

    static async getEntity(domainName) {
        if (!userEntity) {
            const domain = await core.getDomainByName(domainName);
            userEntity = domain.getEntityByName(ENTITY_NAME);
        }
        return userEntity;
    }

    static async getUser(persistence, domainName, id) {
        const entity = await this.getEntity(domainName);
        const userDocument = await entity.getInstance(persistence, id);
        return new this(entity, userDocument);
    }

    static async fromJWT(persistence, domainName, jwt) {
        const entity = await this.getEntity(domainName);
        const userDocument = await entity.getInstance(persistence, jwt.id);
        return new this(entity, userDocument);
    }

    async isFollowing(persistence, type, id) {
        const relationship = this.entity.getRelationshipByName(FOLLOW_RELATIONSHIP_NAME);
        const references = relationship.getTargetReferences(this.userDocument);
        const thisReference = references.find((ref) => ref._id === id && ref.type === type);
        return Boolean(thisReference);
    }

    async follows(persistence, type, id, isFollowing) {
        const associationData = Object.freeze({
            type,
            id
        });

        const relationship = this.entity.getRelationshipByName(FOLLOW_RELATIONSHIP_NAME);

        if (isFollowing) {
            await relationship.addAssociation(this.userDocument, associationData, persistence);
        } else {
            await relationship.removeAssociation(this.userDocument, associationData, persistence);
        }
        await this.entity.updateDocument(persistence, this.userDocument);
    }
}

module.exports = User;
