module.exports = (left, right) => {
    if (left.Position === right.Position) {
        return (left.name || '').localeCompare(right.name || '');
    }

    const leftPosition = (left.Position === 0) ? 0 : (left.Position || 9999);
    const rightPosition = (right.Position === 0) ? 0 : (right.Position || 9999);
    return leftPosition - rightPosition;
};
