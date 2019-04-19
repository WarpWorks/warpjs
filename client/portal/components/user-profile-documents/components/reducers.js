import { reducers as contentReducers } from './content';

export default window.WarpJS.ReactUtils.concatenateReducers([
    contentReducers
]);
