#!/usr/bin/env node

// const debug = require('debug')('W2:scripts:find-entities-with-images');
const Promise = require('bluebird');

const serverUtils = require('./../server/utils');

let paragraphEntity;
let imagesRelationship;

Promise.resolve()
    .then(() => serverUtils.getDomain())
    .then((domain) => Promise.resolve()
        .then(() => {
            paragraphEntity = domain.getEntityByName('Paragraph');
            imagesRelationship = paragraphEntity.getRelationshipByName('Images');
        })

        .then(() => serverUtils.getPersistence(domain.name))
        .then((persistence) => Promise.resolve()
            .then(() => domain.getEntities())
            .then((entities) => entities.filter((entity) => !entity.isAbstract))
            .then((entities) => entities.filter((entity) => entity.isDocument()))
            .then((entities) => Promise.each(entities, (entity) => Promise.resolve()
                .then(() => entity.getRelationshipByName('Overview'))
                .then((relationship) => relationship
                    ? Promise.resolve()
                        .then(() => entity.getDocuments(persistence))
                        .then((docs) => Promise.each(docs, (doc) => Promise.resolve()
                            .then(() => relationship.getDocuments(persistence, doc))
                            .then((paragraphs) => {
                                return paragraphs;
                            })
                            .then((paragraphs) => Promise.each(paragraphs, (paragraph) => Promise.resolve()
                                .then(() => imagesRelationship.getDocuments(persistence, paragraph))
                                .then((images) => Promise.each(images, (image) => Promise.resolve()
                                    .then(() => {
                                        if (image.ImageURL) {
                                            if (!image.Width || !image.Height) {
                                                // eslint-disable-next-line no-console
                                                console.log(`http://localhost:8080/content/domain/${domain.name}/type/${entity.name}/instance/${doc.id}`);
                                            }
                                        }
                                    })
                                ))
                            ))
                        ))
                    : null
                )
            ))
            .finally(() => persistence.close())
        )
    )
;
