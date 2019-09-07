//
// These need to match what is in the Enumeration for Content.Status
//
const status = Object.freeze({
    APPROVED: 'Approved',
    DECLINED: 'Declined',
    DRAFT: 'Draft',
    INDIVIDUAL_CONTRIBUTION: 'IndividualContribution',
    INHERIT_FROM_PARENT: 'InheritFromParent',
    PROPOSAL: 'Proposal',
    RETIRED: 'Retired'
});

module.exports = Object.freeze({
    ...status,
    ALL: [
        status.DRAFT,
        status.PROPOSAL,
        status.INDIVIDUAL_CONTRIBUTION,
        status.APPROVED,
        status.DECLINED,
        status.RETIRED,
        status.INHERIT_FROM_PARENT
    ]
});
