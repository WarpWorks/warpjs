const createModel = require('./create-model');
const parseSMN = require('./parse-smn');

module.exports = (smn, domain) => {
    var model = parseSMN(smn);
    // console.log(JSON.stringify(model, null, 2));

    return createModel(model, domain);
};
