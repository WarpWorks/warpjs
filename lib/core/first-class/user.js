const cloneDeep = require('lodash/cloneDeep');

// const debug = require('./debug')('user');
const Document = require('./document');
const getEntity = require('./get-entity');

const ENTITY_NAME = 'User';
const FOLLOW_RELATIONSHIP_NAME = 'Follows';

class User {
    constructor(domainName, userDocument) {
        this.domainName = domainName;
        this.userDocument = cloneDeep(userDocument || {});
    }

    static async getUser(persistence, domainName, id) {
        const entity = await getEntity(domainName, ENTITY_NAME);
        const userDocument = await entity.getInstance(persistence, id);
        return new this(domainName, userDocument);
    }

    static async fromJWT(persistence, domainName, jwt) {
        const entity = await getEntity(domainName, ENTITY_NAME);
        const userDocument = await entity.getInstance(persistence, jwt.id);
        return new this(domainName, userDocument);
    }

    async isFollowing(persistence, type, id) {
        const entity = await getEntity(this.domainName, ENTITY_NAME);
        const relationship = entity.getRelationshipByName(FOLLOW_RELATIONSHIP_NAME);
        const references = relationship.getTargetReferences(this.userDocument);
        const thisReference = references.find((ref) => ref._id === id && ref.type === type);
        return Boolean(thisReference);
    }

    async follows(persistence, type, id, isFollowing) {
        const associationData = Object.freeze({
            type,
            id
        });

        const entity = await getEntity(this.domainName, ENTITY_NAME);
        const relationship = entity.getRelationshipByName(FOLLOW_RELATIONSHIP_NAME);

        if (isFollowing) {
            await relationship.addAssociation(this.userDocument, associationData, persistence);
        } else {
            await relationship.removeAssociation(this.userDocument, associationData, persistence);
        }
        await entity.updateDocument(persistence, this.userDocument);
    }

    async listDocuments(persistence) {
        const documents = [];

        const entity = await getEntity(this.domainName, ENTITY_NAME);
        const relationships = entity.getRelationships();

        // user is author.
        const reverseAuthor = relationships.find((reln) => reln.isReverse() && reln.getReverseRelationship().name === 'Authors');
        if (reverseAuthor) {
            const authoredDocuments = await reverseAuthor.getDocuments(persistence, this.userDocument);
            authoredDocuments.forEach((doc) => {
                const duplicate = documents.find((d) => d.type === doc.type && d.id === doc.id);
                if (duplicate) {
                    duplicate.relnType.author = true;
                } else {
                    doc.relnType = { author: true };
                    documents.push(doc);
                }
            });
        }

        // user is contributor
        const reverseContributor = relationships.find((reln) => reln.isReverse() && reln.getReverseRelationship().name === 'Contributors');
        if (reverseContributor) {
            const contributedDocuments = await reverseContributor.getDocuments(persistence, this.userDocument);
            contributedDocuments.forEach((doc) => {
                const duplicate = documents.find((d) => d.type === doc.type && d.id === doc.id);
                if (duplicate) {
                    duplicate.relnType.contributor = true;
                } else {
                    doc.relnType = { contributor: true };
                    documents.push(doc);
                }
            });
        }

        // documents followed by user
        const followed = entity.getRelationshipByName('Follows');
        if (followed) {
            const followedDocuments = await followed.getDocuments(persistence, this.userDocument);
            followedDocuments.forEach((doc) => {
                const duplicate = documents.find((d) => d.type === doc.type && d.id === doc.id);
                if (duplicate) {
                    duplicate.relnType.follow = true;
                } else {
                    doc.relnType = { follow: true };
                    documents.push(doc);
                }
            });
        }

        return documents.map((doc) => new Document(this.domainName, doc));
    }
}

User.name = 'User';

module.exports = User;
