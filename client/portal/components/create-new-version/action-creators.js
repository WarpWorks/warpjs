import actions from './actions';

const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const resetVersion = () => actionCreator(actions.RESET_VERSION, {});
export const updateVersion = (nextVersion) => actionCreator(actions.UPDATE_VERSION, { nextVersion });
