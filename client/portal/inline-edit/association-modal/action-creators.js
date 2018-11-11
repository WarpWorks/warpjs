import actions from './actions';

export const initializeState = (state) => Object.freeze({
    type: actions.INITIAL_STATE,
    payload: {
        state
    }
});

export const updateItems = (items) => Object.freeze({
    type: actions.UPDATE_ITEMS,
    payload: {
        items
    }
});
