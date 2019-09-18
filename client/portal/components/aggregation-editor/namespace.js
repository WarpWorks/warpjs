import namespace from './../namespace';

export default (path) => namespace(`AGGREGATION-EDITOR${path ? `.${path}` : ''}`);
