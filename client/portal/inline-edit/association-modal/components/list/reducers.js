import actions from './actions';
import concatenateReducers from './../../../../../react-utils/concatenate-reducers';

const updateItems = (state = {}, action) => {
    return state;
};

export default concatenateReducers([
    { actions: [actions.UPDATE_ITEMS], reducer: updateItems }
]);
