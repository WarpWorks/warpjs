import namespace from './../namespace';

export default (path) => namespace(`EDITION${path ? `.${path}` : ''}`);
