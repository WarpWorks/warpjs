import actions from './actions';

const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const init = (canEdit, createNewVersionLink) => actionCreator(actions.INIT, { canEdit, createNewVersionLink });
