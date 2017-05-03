const _ = require('lodash');
const routesInfo = require('@quoin/expressjs-routes-info');

const utils = require('./../utils');

const PROPS_TO_PICK = [
    'type',
    'id',
    'name',
    'desc',
    'style',
    'value',
    'style',

    // Paragraph
    'containsHTML',

    // Panel
    'label',
    'position',
    'alternatingColors'
];

module.exports = (obj, addSelfLink, propsToPick) => {
    let pickArray = propsToPick ? PROPS_TO_PICK.concat(propsToPick) : PROPS_TO_PICK;

    return utils.createResource(
        (addSelfLink)
            ? routesInfo.expand('entity', { id: obj.id, type: obj.type })
            : '',
        _.extend(_.pick(obj, pickArray), {
            name: obj.Name || obj.name,
            desc: obj.Desc || obj.desc
        })
    );
};
