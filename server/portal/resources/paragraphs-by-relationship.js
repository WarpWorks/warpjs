const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const calloutsByParagraph = require('./callouts-by-paragraph');
const constants = require('./constants');
const convertCustomLinks = require('./convert-custom-links');
const iframesByParagraph = require('./iframes-by-paragraph');
const imagesByParagraph = require('./images-by-paragraph');
const subDocumetsByParagraph = require('./sub-documents-by-paragraph');

const VISIBLE_ON_WEB = [ 'WebAndPDF', 'Web' ];

module.exports = async (persistence, relationship, instance) => {
    const paragraphs = relationship ? await relationship.getDocuments(persistence, instance) : [];
    paragraphs.sort(warpjsUtils.byPositionThenName);

    return Promise.map(
        paragraphs,
        async (paragraph) => {
            // Default visibility to both.
            paragraph.Visibility = paragraph.Visibility || 'WebAndPDF';

            const paragraphResource = warpjsUtils.createResource('', {
                showItem: VISIBLE_ON_WEB.indexOf(paragraph.Visibility) !== -1,
                documentStyle: true,
                id: paragraph.id || paragraph._id,
                name: paragraph.Heading,
                level: paragraph.HeadingLevel || 'H1',
                isOfHeadingLevel: constants.isOfHeadingLevel(paragraph.HeadingLevel || 'H1'),
                description: await convertCustomLinks(persistence, relationship.getDomain(), paragraph.Content)
            });

            const images = await imagesByParagraph(persistence, relationship.getTargetEntity(), paragraph);
            if (images && images.length) {
                paragraphResource.embed('images', images);
            }

            const iframes = await iframesByParagraph(persistence, relationship.getTargetEntity(), paragraph);
            if (iframes && iframes.length) {
                paragraphResource.embed('iframes', iframes);
            }

            const callouts = await calloutsByParagraph(persistence, relationship.getTargetEntity(), paragraph);
            if (callouts && callouts.length) {
                paragraphResource.embed('callouts', callouts);
            }

            const subDocuments = await subDocumetsByParagraph(persistence, relationship.getDomain(), instance, paragraph);
            if (subDocuments && subDocuments.length) {
                paragraphResource.embed('subDocuments', subDocuments);
            }

            return paragraphResource;
        }
    );
};
