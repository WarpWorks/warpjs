import actions from './actions';

const { actionCreator } = window.WarpJS.ReactUtils;

export const initializeState = (myPage, documentsUrl, notificationsUrl) => actionCreator(actions.INITIAL_STATE, { myPage, documentsUrl, notificationsUrl });
