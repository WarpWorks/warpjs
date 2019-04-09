const addImage = require('./add-image');

module.exports = Object.freeze({
    post: (req, res) => addImage(req, res)
});
