import namespace from './namespace';

const { namespaceKeys } = window.WarpJS.ReactUtils;

export default namespaceKeys(namespace, [
    'INITIAL_STATE',
    'UPDATE_ITEMS',
    'UPDATE_TARGETS'
]);
