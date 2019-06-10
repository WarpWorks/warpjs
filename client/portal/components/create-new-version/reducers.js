import actions from './actions';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('reducers');

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const error = (state = {}, action) => {
    const substate = getSubstate(state, namespace);

    substate.error = true;
    substate.errorMessage = action.payload.message;
    substate.err = action.payload.err;

    return setSubstate(state, namespace, substate);
};

const init = (state = {}, action) => {
    const substate = getSubstate(state, namespace);

    substate.canEdit = action.payload.canEdit;
    substate.url = action.payload.createNewVersionLink.href;

    return setSubstate(state, namespace, substate);
};


export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.ERROR ], reducer: error },
    { actions: [ actions.INIT ], reducer: init }
]);
