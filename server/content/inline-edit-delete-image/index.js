const deleteImage = require('./delete-image');

module.exports = Object.freeze({
    post: (req, res) => deleteImage(req, res)
});
