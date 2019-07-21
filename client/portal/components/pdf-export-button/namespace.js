import namespace from './../namespace';

export default (path) => namespace(`PDF-EXPORT${path ? `.${path}` : ''}`);
