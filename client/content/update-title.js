module.exports = (result) => {
    if (result.data && result.data.title) {
        document.title = result.data.title;
    }
};
