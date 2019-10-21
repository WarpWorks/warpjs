const pick = require('lodash/pick');

module.exports = (entity, resource) => {
    entity.getBasicProperties().forEach((property) => {
        resource.embed('basicProperties', pick(property, [
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
