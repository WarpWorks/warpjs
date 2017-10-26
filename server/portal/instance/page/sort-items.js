module.exports = (items) => {
    items.sort((a, b) => a.position - b.position);
    return items;
};
