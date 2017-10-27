const crypt = require('bcrypt-nodejs');
const Promise = require('bluebird');

const generate = Promise.promisify(crypt.hash);

module.exports = (clearText) => generate(clearText, null, null);
