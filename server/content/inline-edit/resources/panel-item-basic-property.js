// const debug = require('debug')('W2:content:inline-edit/resources/panel-item-basic-property');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const BasicTypes = require('./../../../../lib/core/basic-types');

module.exports = (persistence, basicPropertyPanelItem, instance) => Promise.resolve()
    .then(() => basicPropertyPanelItem.getBasicProperty())
    .then((basicProperty) => basicProperty.propertyType === BasicTypes.Text ? basicProperty : null)
    .then((basicProperty) => {
        if (basicProperty) {
            return warpjsUtils.createResource('', {
                type: 'Paragraph',
                id: null,
                reference: {
                    type: basicProperty.type,
                    id: basicProperty.id,
                    name: basicProperty.name
                },
                name: basicPropertyPanelItem.label || basicPropertyPanelItem.name,
                description: basicProperty.getValue(instance)
            });
        }
    })
;
