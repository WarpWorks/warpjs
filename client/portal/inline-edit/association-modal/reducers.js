import cloneDeep from 'lodash/cloneDeep';
import actions from './actions';

const initializeState = (state = {}, action) => {
    return action.payload.state;
};

const updateItems = (state = {}, action) => {
    const cloned = cloneDeep(state);
    cloned.items[0].items = action.payload.items;
    return cloned;
};

const typeChanged = (state = {}, action) => {
    const cloned = cloneDeep(state);

    const relationship = cloned.items[0];
    relationship.targets.forEach((target) => {
        target.selected = target.id === action.payload.id;
        if (target.selected && action.payload.entities) {
            target.entities = cloneDeep(action.payload.entities);
        }
    });

    return cloned;
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.INITIAL_STATE ], reducer: initializeState },
    { actions: [ actions.UPDATE_ITEMS ], reducer: updateItems },
    { actions: [ actions.UPDATE_TARGETS ], reducer: typeChanged },
    window.WarpJS.ReactComponents.reducers
]);
