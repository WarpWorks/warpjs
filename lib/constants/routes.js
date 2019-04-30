const w2 = (routeName) => `W2:${routeName}`;
const content = (routeName) => w2(`content:${routeName}`);

module.exports = Object.freeze({
    pathAlias: Object.freeze({
        path: 'W2:path-alias:path'
    }),

    portal: Object.freeze({
        acceptCookies: 'W2:portal:accept-cookies',
        homepage: 'homepage',
        entity: 'entity',
        follow: 'W2:portal:follow',
        preview: 'W2:portal:preview',
        feedback: 'W2:portal:feedback',
        userProfileDocuments: 'W2:portal:user-profile:documents',
        userProfileNotifications: 'W2:portal:user-profile:notifications'
    }),

    content: Object.freeze({
        home: content('home'),
        domains: content('domains'),
        domain: content('domain'),
        entities: content('entities'),
        entity: content('entity'),
        fileUpload: content('file-upload'),
        history: content('instance-history'),
        inlineEdit: content('inline-edit'),
        inlineEditAssociation: content('inline-edit-association'),
        inlineEditAssociationReorder: content('inline-edit-association-reorder'),
        inlineEditParagraphAggregationUpdate: content('inline-edit-paragraph-aggregation-update'),
        instanceRelationshipItem: content('instance-relationship-item'),
        instanceRelationshipItems: content('instance-relationship-items'),
        instances: content('instances'),
        instance: content('instance'),
        orphans: content('orphans'),
        sibling: content('instance-sibling'),
        relationship: content('instance-relationship'),
        relationshipPage: content('instance-relationship-page'),
        inlineEditAddImage: content('inline-edit-add-image'),
        inlineEditDeleteImage: content('inline-edit-delete-image')
    }),

    studio: Object.freeze({
        entities: 'W2:studio:domain-entities',
        history: 'W2:studio:instance-history',
        home: 'W2:studio:home',
        instances: 'W2:studio:instances',
        instance: 'W2:studio:instance',
        orphans: 'W2:studio:orphans',
        relationship: 'W2:studio:instance-relationship',
        relationshipPage: 'W2:studio:instance-relationship-page',
        types: 'W2:studio:types',
        PROFILES: Object.freeze({
            parentClass: 'parentClass',
            targetEntity: 'targetEntity',
            typeItems: 'typeItems',
            types: 'types',
            withChildren: 'withChildren'
        })
    })
});
