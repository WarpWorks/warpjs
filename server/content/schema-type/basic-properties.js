const _ = require('lodash');

module.exports = (entity, resource) => {
    entity.getBasicProperties().forEach((property) => {
        resource.embed('basicProperties', _.pick(property, [
            'type',
            'name',
            'desc',
            'propertyType',
            'example',
            'defaultValue'
        ]));
    });

    return resource;
};
