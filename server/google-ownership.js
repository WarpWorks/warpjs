const fs = require('fs');
const path = require('path');

// const debug = require('./debug')('google-ownership');
const serverUtils = require('./utils');

const config = serverUtils.getConfig();

module.exports = async (req, res) => {
    const googleFile = path.resolve(path.join(config.folders.w2projects, 'public', req.path));
    if (fs.existsSync(googleFile)) {
        res.status(200).sendFile(googleFile);
    } else {
        res.status(404).send(`Invalid file '${req.path}'.`).end();
    }
};
