const bcrypt = require('bcrypt');

module.exports = async (clearText) => bcrypt.genSalt(10)
    .then((salt) => bcrypt.hash(clearText, salt))
    .then(
        (res) => res,
        () => ''
    );
