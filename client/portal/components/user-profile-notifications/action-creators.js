import actions from './actions';


const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const error = (message, err) => actionCreator(actions.ERROR, { message, err });
export const hideDetails = (type, id) => actionCreator(actions.HIDE_DETAILS);
export const results = (notifications) => actionCreator(actions.RESULTS, { notifications });
export const resetModal = () => actionCreator(actions.RESET_MODAL);
export const showDetails = (type, id) => actionCreator(actions.SHOW_DETAILS, { type, id });
