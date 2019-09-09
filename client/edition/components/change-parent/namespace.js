import namespace from './../namespace';

export default (path) => namespace(`CHANGE-PARENT${path ? `.${path}` : ''}`);
