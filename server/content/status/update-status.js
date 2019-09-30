const warpjsUtils = require('@warp-works/warpjs-utils');

const Document = require('./../../../lib/core/first-class/document');
const DocumentStatus = require('./../../../lib/core/first-class/document-status');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

// const debug = require('./debug')('update-status');

module.exports = async (req, res) => {
    const { domain, type, id, status } = req.params;

    const resource = warpjsUtils.createResource(req, {
        domain,
        type,
        id,
        status,
        description: `Update status of '${domain}/${type}/${id}' to '${status}'`
    }, req);

    const persistance = serverUtils.getPersistence(domain);

    try {
        const entity = await serverUtils.getEntity(domain, type);
        const document = await entity.getInstance(persistance, id);

        const promotions = DocumentStatus.promote(document);
        const indexOf = promotions.indexOf(status);
        if (indexOf === -1) {
            throw new Error(`Invalid promotion status from '${document.Status}' to '${status}'.`);
        }

        document.Status = status;

        resource.status = {
            documentStatus: await Document.computeDocumentStatus(persistance, entity, document),
            promotion: Document.statusPromotion(req, entity, document)
        };

        // TODO: ChangeLogs
        // TODO: updateDocument.

        utils.sendHal(req, res, resource);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Update status *** ERROR ***`, err);
        utils.sendErrorHal(req, res, resource, err);
    } finally {
        persistance.close();
    }
};
