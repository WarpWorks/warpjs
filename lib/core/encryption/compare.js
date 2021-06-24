const bcrypt = require('bcrypt');
const Promise = require('bluebird');

const WarpWorksError = require('./../error');

module.exports = (clearPassword, encryptedPassword) => bcrypt.compare(clearPassword, encryptedPassword)
    .then((res) => res ? Promise.resolve() : Promise.reject(new WarpWorksError()))
;
