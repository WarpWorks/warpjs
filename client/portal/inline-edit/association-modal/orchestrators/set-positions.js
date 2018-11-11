export default (items) => {
    const toUpdate = [];

    items.forEach((item, index) => {
        if (item.relnPosition !== index + 1) {
            item.relnPosition = index + 1;
            toUpdate.push(item);
        }
    });

    return toUpdate;
};
