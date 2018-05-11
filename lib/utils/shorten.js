module.exports = (value, length = 25, fromEnd) => {
    value = String(value);
    if (fromEnd) {
        return (value.length > length)
            ? `...${value.substring(value.length - length)}`
            : value;
    } else {
        return (value.length > length)
            ? `${value.substring(0, length)}...`
            : value;
    }
};
