import { reducers as sharedReducers } from './../../components';

import { reducers as changeParentReducers } from './change-parent';

const { concatenateReducers } = window.WarpJS.ReactUtils;

export default concatenateReducers([
    sharedReducers,

    changeParentReducers
]);
