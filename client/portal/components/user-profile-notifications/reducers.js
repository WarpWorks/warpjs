import actions from './actions';
import namespace from './namespace';

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const init = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    substate.error = false;
    substate.errorMessage = '';
    substate.err = null;
    return setSubstate(state, namespace, substate);
};

const error = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    substate.error = true;
    substate.errorMessage = action.payload.message;
    substate.err = action.payload.err;
    return setSubstate(state, namespace, substate);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ window.WarpJS.ReactUtils.INIT_TYPE ], reducer: init },
    { actions: [ actions.ERROR ], reducer: error },
]);
