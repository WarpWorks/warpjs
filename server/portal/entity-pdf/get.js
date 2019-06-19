const Writable = require('stream').Writable;

const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('get');
const extractDocument = require('./extract-document');
const generatePdf = require('./generate-pdf');
const serverUtils = require('./../../utils');

const createWriteStream = (res) => {
    const ws = new Writable();

    ws._write = (chunk, enc, cb) => {
        res.write(chunk);
        cb();
    };

    ws.on('finish', () => {
        res.end();
    });

    return ws;
};

const generatePdfFilename = (documentResource) => {
    const name = documentResource.name.replace(/\W+/g, '-').toLowerCase();
    return `${name}-v${documentResource.version}`;
};

module.exports = async (req, res) => {
    const { type, id } = req.params;
    const { viewName } = req.query;

    const resource = warpjsUtils.createResource(req, {
        description: `Exporting document '${type}/${id}' to PDF.`
    }, req);

    const persistence = await serverUtils.getPersistence();

    try {
        const documentResource = await extractDocument(req, persistence, type, id, viewName);
        if (documentResource) {
            // FIXME: Send PDF file.
            resource.embed('pages', documentResource);
            const pdfDoc = await generatePdf(documentResource);

            const ws = createWriteStream(res);

            res.set('Content-Disposition', `attachment; filename=${generatePdfFilename(documentResource)}.pdf`);

            res.type('appplication/pdf');
            res.status(200);
            pdfDoc.pipe(ws);
            pdfDoc.end();
        } else {
            throw new Error(`Document '${type}/${id}' is not visible.`);
        }
    } catch (err) {
        warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
        // FIXME: Send HTML page to be rendered.
    } finally {
        await persistence.close();
    }
};
