import actions from './actions';


const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const error = (message, err) => actionCreator(actions.ERROR, { message, err });
export const results = (notifications) => actionCreator(actions.RESULTS, { notifications });
export const showDetails = (type, id) => actionCreator(actions.SHOW_DETAILS, { type, id });
