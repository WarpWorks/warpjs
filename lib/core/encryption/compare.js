const crypt = require('bcrypt-nodejs');
const Promise = require('bluebird');

const WarpWorksError = require('./../error');

const cryptCompare = Promise.promisify(crypt.compare);

module.exports = async (clearPassword, encryptedPassword) => {
    const res = await cryptCompare(clearPassword, encryptedPassword);
    if (!res) {
        throw new WarpWorksError();
    }
};
