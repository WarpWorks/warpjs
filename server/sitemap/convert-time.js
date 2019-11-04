module.exports = (lastUpdated) => (new Date(lastUpdated)).toISOString().replace(/T.*/, '');
