const Promise = require('bluebird');

// FIXME: This hack doesn't use the model.
module.exports = (persistence, userEntity, userInstance) => Promise.resolve()
    .then(() => userEntity.getOverview(persistence, userInstance))
    .then((overviews) => (overviews && overviews.length) ? overviews[0] : null)
    .then((overview) => overview ? overview.Images : null)
    .then((images) => images && images.length ? images[0] : null)
    .then((image) => image && image.ImageURL ? image.ImageURL : null)
;
