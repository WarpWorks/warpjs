const Domain = require('./../models/domain');
const warpCore = require('./../index');

module.exports = (name, desc, recreate) => {
    return new Domain(warpCore, name, desc, recreate);
};
