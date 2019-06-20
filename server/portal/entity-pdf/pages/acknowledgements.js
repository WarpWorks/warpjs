const clone = require('lodash/clone');

// const debug = require('./debug')('acknowledgements');

const extractUsers = (items) => items.reduce(
    (memo, item) => {
        if (item._embedded.items && item._embedded.items.length) {
            return memo.concat(item._embedded.items.map((user) => {
                if (user._embedded.companies) {
                    const companies = user._embedded.companies.map((company) => company.label);
                    return `${user.label} (${companies.join('/')})`;
                } else {
                    return user.label;
                }
            }));
        } else {
            return memo;
        }
    },
    []
);

const oxfordComma = (items) => {
    if (!items.length) {
        return '';
    } else if (items.length === 1) {
        return items[0];
    } else if (items.length === 2) {
        return items.join(' and ');
    } else {
        const clones = clone(items);
        clones[clones.length - 1] = ` and ${clones[clones.length - 1]}`;
        return clones.join(', ');
    }
};

module.exports = (documentResource) => {
    const year = (new Date()).getFullYear();

    const content = [{
        text: `Copyright © ${year}, Industrial Internet Consortium`,
        pageBreak: 'before'
    }, {
        text: 'Acknowledgements',
        bold: true,
        headlineLevel: 1,
    }, {
        text: "TODO: This document is a work product of the Industrial Internet Consortium (IIC) ...WG and its ...TG."
    }];

    if (documentResource._embedded) {
        if (documentResource._embedded.editors && documentResource._embedded.editors.length) {
            content.push({
                text: 'Editors',
                bold: true
            });

            const names = extractUsers(documentResource._embedded.editors);
            content.push({
                text: oxfordComma(names)
            });
        }

        if (documentResource._embedded.authors && documentResource._embedded.authors.length) {
            content.push({
                text: 'Authors',
                bold: true
            });

            content.push({
                text: "The following persons have written substantial portion of material content in this document:"
            });

            const names = extractUsers(documentResource._embedded.authors);
            content.push({
                text: oxfordComma(names)
            });
        }

        if (documentResource._embedded.contributors && documentResource._embedded.contributors.length) {
            content.push({
                text: 'Contributors',
                bold: true
            });

            content.push({
                text: "The following persons have contributed valuable ideas and feedback that significantly improve the content and quality of this document:"
            });

            const names = extractUsers(documentResource._embedded.contributors);
            content.push({
                text: oxfordComma(names)
            });
        }

        content.push({
            text: "IIC ISSUE REPORTING",
            bold: true
        });

        content.push({
            text: [
                "All IIC documents are subject to continuous review and improvement. ",
                "As part of this process, we encourage readers to report any ambiguities, ",
                "inconsistencies or inaccuracies they may find in this Document or ",
                "other IIC materials by sending an email to ",
                { text: "admin@iiconsortium.org", italics: true },
                "."
            ]
        });
    }

    return content;
};
