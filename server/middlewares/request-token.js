const random = require('random-words');

module.exports = (req, res, next) => {
    const token = random({ exactly: 5, join: '-' });
    req.warpjsRequestToken = token;
    res.set('X-WarpJS-Token', token);
    next();
};
