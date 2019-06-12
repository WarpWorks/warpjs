import namespace from './../namespace';

export default (path) => namespace(`PAGE_HAL${path ? `.${path}` : ''}`);
