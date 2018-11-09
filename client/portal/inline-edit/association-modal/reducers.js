import actions from './actions';
import reducers from './components/reducers';

const initializeState = (state = {}, action) => {
    return action.payload.state;
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [actions.INITIAL_STATE], reducer: initializeState },
    reducers
]);
