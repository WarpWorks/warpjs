module.exports = (updatePath, updatePathLevel) => updatePath ? updatePath.split('.')[updatePathLevel].split(':') : null;
