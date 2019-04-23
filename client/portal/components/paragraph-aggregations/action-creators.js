import actions from './actions';

const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const initialize = (aggregations, aggregationSelected, warpjsData, clickedElement) => actionCreator(actions.INITIAL_STATE, { aggregations, aggregationSelected, warpjsData, clickedElement });

export const updateAggregation = (aggregationSelected) => actionCreator(actions.UPDATE_AGGREGATION, { aggregationSelected });
