import actions from './actions';

const { actionCreator } = window.WarpJS.ReactUtils;

export const hide = () => actionCreator(actions.HIDE);
export const resetVersion = () => actionCreator(actions.RESET_VERSION, {});
export const show = () => actionCreator(actions.SHOW);
export const updateVersion = (nextVersion) => actionCreator(actions.UPDATE_VERSION, { nextVersion });
