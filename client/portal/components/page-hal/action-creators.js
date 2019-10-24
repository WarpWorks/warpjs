import actions from './actions';

const { actionCreator } = window.WarpJS.ReactUtils;

export const init = (pageHal) => actionCreator(actions.INIT, { pageHal });
