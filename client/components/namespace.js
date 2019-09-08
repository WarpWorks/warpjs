import namespace from './../namespace';

export default (key) => namespace(`COMPONENTS${key ? `.${key}` : ''}`);
