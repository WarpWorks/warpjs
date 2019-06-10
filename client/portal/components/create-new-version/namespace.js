import namespace from './../namespace';

export default (path) => namespace(`CREATE-NEW-VERSION${path ? `.${path}` : ''}`);
