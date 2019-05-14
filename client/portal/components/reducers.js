import { reducers as documentFiltersReducers } from './document-filters';

export default window.WarpJS.ReactUtils.concatenateReducers([
    documentFiltersReducers,
]);
