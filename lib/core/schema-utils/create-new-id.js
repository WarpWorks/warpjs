const cache = {};

module.exports = async (DOMAIN) => {
    const warpCore = require('./../index');

    if (!cache[DOMAIN]) {
        const iicDomain = await warpCore.getDomainByName(DOMAIN);
        cache[DOMAIN] = iicDomain.createNewID();
    } else {
        cache[DOMAIN] += 1;
    }
    return cache[DOMAIN];
};
