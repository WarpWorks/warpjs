import namespace from './../namespace';

export default (path) => namespace(`DOCUMENT-EDITION${path ? `.${path}` : ''}`);
