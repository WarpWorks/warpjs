const pick = require('lodash/pick');
const warpjsUtils = require('@warp-works/warpjs-utils');

const validEnumSelections = require('./../../../lib/core/valid-enum-selections');

// FIXME: Make reusable.
const MIN_MAX = {
    [validEnumSelections.One]: { min: 1, max: 1 },
    [validEnumSelections.ZeroOne]: { min: 0, max: 1 },
    [validEnumSelections.ZeroMany]: {},
    [validEnumSelections.OneMany]: { min: 1 }
};

module.exports = (entity, resource) => {
    entity.getEnums().forEach((property) => {
        const choices = property.literals.map((literal) => pick(literal, [
            'type',
            'name',
            'desc',
            'position'
        ])).sort(warpjsUtils.byPositionThenName);

        resource.embed('enumProperties', {
            type: property.type,
            name: property.name,
            desc: property.desc,
            conditions: MIN_MAX[property.validEnumSelections],
            choices
        });
    });

    return resource;
};
