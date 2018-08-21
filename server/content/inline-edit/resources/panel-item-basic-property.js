const debug = require('debug')('W2:content:inline-edit/resources/panel-item');
const Promise = require('bluebird');
// const warpjsUtils = require('@warp-works/warpjs-utils');

const BasicTypes = require('./../../../../lib/core/basic-types');

module.exports = (persistence, basicPropertyPanelItem, instance) => Promise.resolve()
    .then(() => basicPropertyPanelItem.getBasicProperty())
    .then((basicProperty) => basicProperty.propertyType === BasicTypes.Text ? basicProperty : null)
    .then((basicProperty) => {
        if (basicProperty) {
            debug(`TODO: Found a TEXT field.`);
        }
    })
;
