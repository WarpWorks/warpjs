import actions from './actions';

const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const initialize = (aggregations, aggregationSelected) => actionCreator(actions.INITIAL_STATE, { aggregations, aggregationSelected });

export const updateAggregation = (aggregationSelected) => actionCreator(actions.UPDATE_AGGREGATION, { aggregationSelected });
