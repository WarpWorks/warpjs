import namespace from './../namespace';

export default (path) => namespace(`instance${path ? `.${path}` : ''}`);
