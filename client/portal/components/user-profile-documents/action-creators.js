import actions from './actions';

const { actionCreator } = window.WarpJS.ReactUtils;

export const error = (message, err) => actionCreator(actions.ERROR, { message, err });
export const results = (documents) => actionCreator(actions.RESULTS, { documents });
