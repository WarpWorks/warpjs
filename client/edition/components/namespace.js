import namespace from './../namespace';

export default (path) => namespace(`COMPONENTS${path ? `.${path}` : ''}`);
