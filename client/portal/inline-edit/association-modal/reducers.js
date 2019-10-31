import cloneDeep from 'lodash/cloneDeep';

import actions from './actions';

const { concatenateReducers } = window.WarpJS.ReactUtils;
const { reducers } = window.WarpJS.ReactComponents;

export default concatenateReducers([
    {
        actions: [ actions.INITIAL_STATE ],
        reducer: (state = {}, action) => action.payload.state
    }, {
        actions: [ actions.UPDATE_ITEMS ],
        reducer: (state = {}, action) => {
            const cloned = cloneDeep(state);
            cloned.items[0].items = action.payload.items;
            return cloned;
        }
    }, {
        actions: [ actions.UPDATE_TARGETS ],
        reducer: (state = {}, action) => {
            const cloned = cloneDeep(state);

            const relationship = cloned.items[0];
            relationship.targets.forEach((target) => {
                target.selected = target.id === action.payload.id;
                if (target.selected && action.payload.entities) {
                    target.entities = cloneDeep(action.payload.entities);
                }
            });

            return cloned;
        }
    },
    reducers
]);
