const ComplexTypes = require('./../complex-types');
const createBasicProperty = require('./create-basic-property');
const createAssociation = require('./create-association');

module.exports = async (DOMAIN, persistence, changesToMake) => {
    if (changesToMake.type === ComplexTypes.BasicProperty) {
        return createBasicProperty(DOMAIN, persistence, changesToMake);
    } else if (changesToMake.type === ComplexTypes.Relationship) {
        return createAssociation(DOMAIN, persistence, changesToMake);
    } else {
        // eslint-disable-next-line no-console
        console.error(`Unsupported type='${changesToMake.type}'.`);
    }
};
