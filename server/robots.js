const fs = require('fs');
const path = require('path');

// const debug = require('./debug')('robots');
const serverUtils = require('./utils');

const config = serverUtils.getConfig();

module.exports = async (req, res) => {
    const host = req.host.replace(/\./g, '-');

    const robotsHost = path.resolve(path.join(config.folders.w2projects, 'public', `robots.${host}.txt`));

    if (fs.existsSync(robotsHost)) {
        res.status(200).sendFile(robotsHost);
    } else {
        const robotsDefault = path.resolve(path.join(config.folders.w2projects, 'public', 'robots.default.txt'));
        res.status(200).sendFile(robotsDefault);
    }
};
