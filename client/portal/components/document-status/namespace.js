import namespace from './../namespace';

export default (path) => namespace(`DOCUMENT-STATUS${path ? `.${path}` : ''}`);
