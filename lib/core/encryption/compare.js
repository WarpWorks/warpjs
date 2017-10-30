const crypt = require('bcrypt-nodejs');
const Promise = require('bluebird');

const WarpWorksError = require('./../error');

const cryptCompare = Promise.promisify(crypt.compare);

module.exports = (clearPassword, encryptedPassword) => Promise.resolve()
    .then(() => cryptCompare(clearPassword, encryptedPassword))
    .then((res) => res ? Promise.resolve() : Promise.reject(new WarpWorksError()))
;
