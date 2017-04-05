const _ = require('lodash');
const routesInfo = require('@quoin/expressjs-routes-info');

const utils = require('./../utils');

// FIXME: Use of BasicProperties instead of this.
const PROPS_TO_PICK = [
    'type',
    'id',
    'name',
    'desc',
    'style',
    'value',
    'style',

    // Paragraph
    'Heading',
    'Content',
    'containsHTML',

    // Panel
    'label',
    'position',
    'alternatingColors',

    // Images
    'ImageURL',
    'Caption',
    'AltText',
    'Width',
    'Height',

    // ImageArea
    'Coords',
    'Alt',
    'HRef',
    'Title'
];

module.exports = (obj, addSelfLink) => {
    return utils.createResource(
        (addSelfLink)
            ? routesInfo.expand('entity', { id: obj.id, type: obj.type })
            : '',
        _.extend(_.pick(obj, PROPS_TO_PICK), {
            name: obj.Name || obj.name,
            desc: obj.Desc || obj.desc
        })
    );
};
