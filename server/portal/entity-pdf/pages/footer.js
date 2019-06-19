module.exports = (documentResource) => (currentPage, pageCount) => {
    if (currentPage === 1) {
        return null;
    }

    return {
        columns: [{
            text: "TODO: Document ID",
            alignment: 'left',
            width: '40%',
        }, {
            text: `- ${currentPage} -`,
            alignment: 'center',
            width: '20%'
        }]
    };
};
