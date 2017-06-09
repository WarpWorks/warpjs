module.exports = (left, right) => {
    if (left.Position === right.Position) {
        return (left.name || '').localeCompare(right.name || '');
    }
    return (left.Position || 9999) - (right.Position || 99999);
};
