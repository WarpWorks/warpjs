import namespace from './../namespace';

export default (path) => namespace(`components${path ? `.${path}` : ''}`);
