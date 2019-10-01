const DOCUMENT_STATUS = require('./../../constants/document-status');

module.exports = Object.freeze({
    DEFAULT: DOCUMENT_STATUS.DRAFT,
    INHERITANCE: 'InheritFromParent',
    NEW_VERSION_STATUS: DOCUMENT_STATUS.DRAFT,
    PROPERTY: 'Status',
    PUBLIC: Object.freeze([ DOCUMENT_STATUS.PROPOSAL, DOCUMENT_STATUS.APPROVED, DOCUMENT_STATUS.INDIVIDUAL_CONTRIBUTION ]),
    promote: (document) => {
        switch (document.Status) {
            case DOCUMENT_STATUS.APPROVED:
                return [
                    DOCUMENT_STATUS.RETIRED
                ];

            case DOCUMENT_STATUS.DECLINED:
                return [];

            case DOCUMENT_STATUS.INDIVIDUAL_CONTRIBUTION:
                return [];

            case DOCUMENT_STATUS.INHERIT_FROM_PARENT:
                return [];

            case DOCUMENT_STATUS.PROPOSAL:
                return [
                    DOCUMENT_STATUS.APPROVED,
                    DOCUMENT_STATUS.DECLINED
                ];

            case DOCUMENT_STATUS.RETIRED:
                return [];

            default: // mainly Draft or empty/invalid.
                return (document.type === 'IndividualContribution')
                    ? [ DOCUMENT_STATUS.INDIVIDUAL_CONTRIBUTION ]
                    : [ DOCUMENT_STATUS.INHERIT_FROM_PARENT, DOCUMENT_STATUS.PROPOSAL ]
                ;
        }
    }
});
