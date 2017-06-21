const utils = require('./../../utils');

function insertOneCB(done, domain, error, result) {
    if (error) {
        const msg = `Error creating root instance for ${domain}: ${error}`;
        console.log(msg);
        done([{
            error: true,
            status: msg
        }]);
    } else {
        const rootInstance = result.ops[0];
        const msg = `Created new root instance for ${domain} with ID ${rootInstance._id}`;
        done([{
            error: false,
            status: msg,
            rootInstance: utils.createResourceFromDocument(rootInstance)
        }]);
    }
}

function findOneCB(done, domain, collection, error, rootInstance) {
    if (rootInstance) {
        const msg = `Found root instance for ${domain}, ID=${rootInstance._id}`;
        console.log(msg);

        done([{
            error: false,
            status: msg,
            rootInstance: utils.createResourceFromDocument(rootInstance)
        }]);
    } else {
        const newData = {
            domainName: domain,
            type: domain,
            isRootInstance: true,
            parentID: null
        };
        collection.insertOne(newData, insertOneCB.bind(null, done, domain));
    }
}

function implementation(domain, db, collection, currentCommand, done) {
    collection.findOne({isRootInstance: true}, findOneCB.bind(null, done, domain, collection));
}

implementation.TYPE = 'GetRootInstance';

module.exports = implementation;
