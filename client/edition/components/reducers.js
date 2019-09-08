import { reducers as sharedReducers } from './../../components';

const { concatenateReducers } = window.WarpJS.ReactUtils;

export default concatenateReducers([
    sharedReducers
]);
