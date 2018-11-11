export default (items, x, y) => {
    const tmp = items[x];
    items[x] = items[y];
    items[y] = tmp;
};
