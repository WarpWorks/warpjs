import actions from './actions';

const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const initialize = () => actionCreator(actions.INITIALIZE, {});
export const updateFilter = (attribute, nextState) => actionCreator(actions.UPDATE_FILTER, { attribute, nextState });
