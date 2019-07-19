import namespace from './../namespace';

export default (path) => namespace(`BREADCRUMB-ACTIONS${path ? `.${path}` : ''}`);
