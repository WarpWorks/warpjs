module.exports = (lastUpdated) => (lastUpdated ? new Date(lastUpdated) : new Date()).toISOString().replace(/T.*/, '');
