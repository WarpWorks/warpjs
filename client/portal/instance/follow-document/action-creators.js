
import actions from './actions';

const actionCreator = window.WarpJS.ReactUtils.actionCreator;

export const initializeState = (following, followUrl, unfollowUrl) => actionCreator(actions.INITIAL_STATE, {
    following, followUrl, unfollowUrl
});

export const updateFollow = (newFollowing) => actionCreator(actions.UPDATE_FOLLOW, {
    following: newFollowing
});
