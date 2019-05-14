import namespace from './../namespace';

export default (path) => namespace(`DOCUMENT_FILTERS${path ? `.${path}` : ''}`);
