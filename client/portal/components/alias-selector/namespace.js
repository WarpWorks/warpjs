import namespace from './../namespace';

export default (path) => namespace(`ALIAS-SELECTOR${path ? `.${path}` : ''}`);
