import packageJson from './../../package.json';

const { selector } = window.WarpJS.ReactUtils;

export default (state, Component, id) => selector(state, packageJson.name, Component.displayName, id);
