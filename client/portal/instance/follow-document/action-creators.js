
import actions from './actions';

const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const initializeState = (following, url) => actionCreator(actions.INITIAL_STATE, {following, url});
