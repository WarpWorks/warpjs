import actions from './actions';
import namespace from './namespace';

// const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const { concatenateReducers, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const init = (state = {}, action) => {
    return setNamespaceSubstate(state, namespace, action.payload.pageHal);
};

export default concatenateReducers([
    { actions: [ actions.INIT ], reducer: init }
]);
