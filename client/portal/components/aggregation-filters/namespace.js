import namespace from './../namespace';

export default (path) => namespace(`AGGREGATION-FILTERS${path ? `.${path}` : ''}`);
