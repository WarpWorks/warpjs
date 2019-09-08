import { reducers as pageHalReducers } from './page-hal';

const { concatenateReducers } = window.WarpJS.ReactUtils;

export default concatenateReducers([
    window.WarpJS.ReactComponents.reducers,
    pageHalReducers
]);
