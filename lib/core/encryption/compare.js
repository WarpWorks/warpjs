const Promise = require('bluebird');

const WarpWorksError = require('./../error');

module.exports = (clearPassword, encryptedPassword) => new Promise((resolve, reject) => {
  if (!clearPassword || !encryptedPassword || (clearPassword !== encryptedPassword)) {
    reject(new WarpWorksError());
  }
  resolve();
});
