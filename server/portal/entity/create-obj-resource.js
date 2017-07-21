const _ = require('lodash');
const routesInfo = require('@quoin/expressjs-routes-info');

const warpjsUtils = require('@warp-works/warpjs-utils');

const PROPS_TO_PICK = [
    'type',
    'id',
    'name',
    'desc',
    'style',
    'value',
    'style',

    // Paragraph
    'propertyType',
    'containsHTML',

    // Panel
    'label',
    'position',
    'alternatingColors',

    // Panel item relationship description
    'relnDesc'
];

module.exports = (obj, addSelfLink, propsToPick) => {
    let pickArray = propsToPick ? PROPS_TO_PICK.concat(propsToPick) : PROPS_TO_PICK;

    return warpjsUtils.createResource(
        (addSelfLink)
            ? routesInfo.expand('entity', { id: obj.id, type: obj.type })
            : '',
        _.extend(_.pick(obj, pickArray), {
            name: obj.Name || obj.name,
            desc: obj.Desc || obj.desc
        })
    );
};
