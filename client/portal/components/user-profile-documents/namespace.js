import namespace from './../namespace';

export default (path) => namespace(`USER-PROFILE-DOCUMENTS${path ? `.${path}` : ''}`);
