import namespace from './../namespace';

export default (key) => namespace(`PORTAL${key ? `.${key}` : ''}`);
