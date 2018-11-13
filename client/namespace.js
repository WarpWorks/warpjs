import packageJson from './../package.json';

export default (key) => window.WarpJS.ReactUtils.namespace(`${packageJson.name}.${key}`);
