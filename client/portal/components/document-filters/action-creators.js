import actions from './actions';

const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const updateFilter = (id, attribute, nextState) => actionCreator(actions.UPDATE_FILTER, { id, attribute, nextState });
export const updateSortBy = (id, value) => actionCreator(actions.UPDATE_SORT_BY, { id, value });
