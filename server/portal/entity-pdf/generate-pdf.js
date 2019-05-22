const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const debug = require('./debug')('generate-pdf');
const extractDocument = require('./extract-document');
const serverUtils = require('./../../utils');

module.exports = async (req, res) => {
    const { type, id } = req.params;
    const { viewName } = req.query;

    const resource = warpjsUtils.createResource(req, {
        description: `Exporting document '${type}/${id}' to PDF.`
    });

    const persistence = await serverUtils.getPersistence();

    try {
        const documentResource = await extractDocument(req, persistence, type, id, viewName);
        // FIXME: Send PDF file.
        if (documentResource) {
            debug(`Need generate pdf from content. documentResource=`, documentResource);
        } else {
            throw new Error(`Document '${type}/${id}' is not visible.`);
        }
        warpjsUtils.sendHal(req, res, resource, RoutesInfo);
    } catch (err) {
        warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
        // FIXME: Send HTML page to be rendered.
    } finally {
        await persistence.close();
    }
};
