import packageJson from './../package.json';

const { namespace } = window.WarpJS.ReactUtils;

export default (key) => namespace(`${packageJson.name}.${key}`);
