import concatenateReducers from './../../../../react-utils/concatenate-reducers';
import listReducers from './list/reducers';

export default concatenateReducers([
    listReducers
]);
