import namespace from './../namespace';

export default (path) => namespace(`CONTENT${path ? `.${path}` : ''}`);
