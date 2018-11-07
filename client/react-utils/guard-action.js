export default (actionTypes = [], reducer) => (state = {}, action) => (actionTypes.indexOf(action.type) === -1) ? state : reducer(state, action);
