import actions from './actions';

const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const initializeState = (myPage) => actionCreator(actions.INITIAL_STATE, {
    myPage
});
