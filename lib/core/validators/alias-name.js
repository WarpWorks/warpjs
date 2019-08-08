const VALID_ALIAS_NAME = /^[A-Za-z0-9-]+$/;

module.exports = (name) => Boolean(name.match(VALID_ALIAS_NAME));
