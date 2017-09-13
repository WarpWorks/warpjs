module.exports = (resource, key, items) => {
    resource.embed(key, items);
    return resource;
};
