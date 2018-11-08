import actions from './actions';

export const updateItems = (items) => Object.freeze({
    type: actions.UPDATE_ITEMS,
    payload: {
        items
    }
});
