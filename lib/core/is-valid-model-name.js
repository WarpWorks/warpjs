module.exports = (name) => {
    return name && !/\W/i.test(name) && name.length > 1;
};
