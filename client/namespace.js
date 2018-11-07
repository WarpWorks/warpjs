import packageJson from './../package.json';

export default (key) => `${packageJson.name}.${key}`.replace(/@/g, '').replace(/[/_]/g, '-').toUpperCase();
