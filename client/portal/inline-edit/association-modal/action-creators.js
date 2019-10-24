import actions from './actions';

const { actionCreator } = window.WarpJS.ReactUtils;

export const initializeState = (state) => actionCreator(actions.INITIAL_STATE, { state });
export const updateItems = (items) => actionCreator(actions.UPDATE_ITEMS, { items });
export const typeChanged = (id, entities) => actionCreator(actions.UPDATE_TARGETS, { id, entities });
