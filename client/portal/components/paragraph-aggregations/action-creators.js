import actions from './actions';

const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const initialize = (aggregations, aggregationSelected, warpjsData) => actionCreator(actions.INITIAL_STATE, { aggregations, aggregationSelected, warpjsData });

export const updateAggregation = (aggregationSelected) => actionCreator(actions.UPDATE_AGGREGATION, { aggregationSelected });
