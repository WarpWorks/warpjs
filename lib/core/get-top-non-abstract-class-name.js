module.exports = (aClass) => {
    return aClass.getBaseClass ? aClass.getBaseClass().name : aClass.name;
};
