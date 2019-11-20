export default (a, b) => {
    if (a.docs.length === b.docs.length) {
        return a.label.localeCompare(b.label);
    } else if (a.docs.length > b.docs.length) {
        return -1;
    } else {
        return 1;
    }
};
