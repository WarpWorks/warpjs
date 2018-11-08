import extend from 'lodash/extend';

export default (namespace, keys) => Object.freeze(keys.reduce((map, key) => extend(map, { [key]: namespace(key) }), {}));
