module.exports = (updatePath, updatePathLevel) => {
    return updatePath.split('.')[updatePathLevel].split(':');
};
