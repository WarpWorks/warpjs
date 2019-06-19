module.exports = (documentResource) => (currentPage, pageCount, pageSize) => {
    if (currentPage === 1) {
        return null;
    }

    return {
        columns: [{
            text: documentResource.name,
            alignment: 'left',
            width: '60%',
            margin: 20,
        }, {
            text: "TODO: Section name",
            alignment: 'right',
            width: '40%',
            margin: 20,
        }]
    };
};
