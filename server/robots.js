const fs = require('fs');
const path = require('path');

const serverUtils = require('./utils');

const config = serverUtils.getConfig();

const cache = {};

const EXPIRY_DELTA = 24 * 60 * 60 * 1000; // 24 hours
const ROBOTS_FILE = path.join(config.folders.w2projects, 'public', 'robots.txt');

module.exports = async (req, res) => {
    if (!cache.content || Date.now() > cache.expiry) {
        if (!fs.existsSync(ROBOTS_FILE)) {
            res.status(404).send(`'robots.txt' file not found.`);
            return;
        }

        cache.content = fs.readFileSync(ROBOTS_FILE, { encoding:'utf8' });
        cache.expiry = Date.now() + EXPIRY_DELTA;
    }

    res.set('Content-Type', 'text/plain');
    res.send(cache.content);
};
