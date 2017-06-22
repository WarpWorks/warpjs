module.exports = function() {
    if (this.mapMatrix.subColumnHeaders.length > 0 && this.mapMatrix.subRows.length > 0) {
        return true;
    } else {
        return false;
    }
};
