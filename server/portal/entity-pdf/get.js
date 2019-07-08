const Writable = require('stream').Writable;

const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('get');
const extractDocument = require('./extract-document');
const generatePdf = require('./generate-pdf');
const serverUtils = require('./../../utils');
const getHtml = require('./../entity-html/get');

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
            resource.embed('pages', documentResource);
            const pdfDoc = await generatePdf(documentResource);
            if (!pdfDoc) {
                throw new Error('issue generating PDF');
            }
            res.type('application/pdf');
            res.set('Content-Disposition', `inline; filename="${generatePdfFilename(documentResource)}.pdf"`);
            // res.set('Content-Disposition', `attachment; filename="${generatePdfFilename(documentResource)}.pdf"`);
            res.status(200);

            const ws = createWriteStream(res);
            pdfDoc.pipe(ws);
            pdfDoc.end();
        } else {
            throw new Error(`Document '${type}/${id}' is not visible.`);
        }
    } catch (err) {
        getHtml(req, res);
    } finally {
        await persistence.close();
    }
};
