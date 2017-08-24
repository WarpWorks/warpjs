const open = require('./open');
const save = require('./save');

module.exports = ($, instanceDoc) => {
    open($, instanceDoc);
    save($, instanceDoc);
};
