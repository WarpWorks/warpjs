import actions from './actions';

export const initializeState = (state) => Object.freeze({
    type: actions.INITIAL_STATE,
    payload: {
        state
    }
});
