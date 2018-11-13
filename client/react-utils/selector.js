import packageJson from './../../package.json';

export default (state, Component, id) => {
    return window.WarpJS.ReactUtils.selector(state, packageJson.name, Component.displayName, id);
};
