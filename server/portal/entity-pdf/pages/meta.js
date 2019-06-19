module.exports = (documentResource) => ({
    title: documentResource.name,
    author: documentResource.author,
    subject: documentResource.description,
    keywords: documentResource.keywords,
    creator: 'IIC Resource Hub',
    modDate: new Date(documentResource.lastUpdated)
});
