import namespace from './../namespace';

export default (path) => namespace(`PARAGRAPH-AGGREGATIONS${path ? `.${path}` : ''}`);
