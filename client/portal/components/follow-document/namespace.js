import namespace from './../namespace';

export default (path) => namespace(`FOLLOW_DOCUMENT${path ? `.${path}` : ''}`);
