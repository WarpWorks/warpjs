const random = require('random-words');

module.exports = (req, res, next) => {
    req.warpjsRequestToken = random({exactly: 5, join: ' '});
    next();
};
