const uploadFile = require('./upload-file');

module.exports = Object.freeze({
    post: (req, res) => uploadFile(req, res)
});
