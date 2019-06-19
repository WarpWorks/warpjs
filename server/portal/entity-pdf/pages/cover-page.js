module.exports = (documentResource) => [
    {
        text: "Cover page image",
        alignment: 'center'
    },
    {
        text: documentResource.name,
        fontSize: 24,
        bold: true,
        alignment: 'center'
    },
    {
        text: "TODO: Document ID",
        alignment: 'center'
    }
];
