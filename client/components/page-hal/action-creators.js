import actions from './actions';

const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const init = (pageHal) => actionCreator(actions.INIT, { pageHal });
