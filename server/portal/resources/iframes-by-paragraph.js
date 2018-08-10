// const debug = require('debug')('W2:portal:resources/iframes-by-paragraph');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, paragraphEntity, paragraphInstance) => Promise.resolve()
    .then(() => paragraphEntity ? paragraphEntity.getRelationshipByName('IFrames') : null)
    .then((relationship) => relationship ? relationship.getDocuments(persistence, paragraphInstance) : [])
    .then((iframes) => iframes.map((iframe) => warpjsUtils.createResource(iframe.Src || '', {
        type: iframe.type,
        id: iframe.id || iframe._id,
        name: iframe.Name,
        width: iframe.Width,
        height: iframe.Height,
        srcdoc: iframe.SrcDoc,
        sandbox: Boolean(iframe.Sandbox),
        allow: iframe.Allow,
        allowfullscreen: Boolean(iframe.AllowFullScreen)
    })))
;
