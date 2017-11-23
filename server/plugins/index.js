const getAuthPlugin = require('./get-auth-plugin');
const getTypedPlugin = require('./get-typed-plugin');
const init = require('./init');
const register = require('./register');

module.exports = {
    getAuthPlugin: (config) => getAuthPlugin(config),
    getTypedPlugin: (type) => getTypedPlugin(type),
    init: () => init(),
    register: (app, config, Persistence, baseUrl, staticUrl) => register(app, config, Persistence, baseUrl, staticUrl)
};
