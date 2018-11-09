import cloneDeep from 'lodash/cloneDeep';

import actions from './actions';

const updateItems = (state = {}, action) => {
    const cloned = cloneDeep(state);
    cloned.items[0].items = action.payload.items;
    return cloned;
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [actions.UPDATE_ITEMS], reducer: updateItems }
]);
