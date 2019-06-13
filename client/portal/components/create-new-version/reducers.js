import actions from './actions';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('reducers');

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const hide = (state = {}, action) => {
    const substate = getSubstate(state, namespace);

    substate.showCreate = false;

    return setSubstate(state, namespace, substate);
};

const resetVersion = (state = {}, action) => {
    const substate = getSubstate(state, namespace);

    delete substate.nextVersion;

    return setSubstate(state, namespace, substate);
};

const show = (state = {}, action) => {
    const substate = getSubstate(state, namespace);

    substate.showCreate = true;

    return setSubstate(state, namespace, substate);
};

const updateVersion = (state = {}, action) => {
    const substate = getSubstate(state, namespace);

    substate.nextVersion = action.payload.nextVersion;

    return setSubstate(state, namespace, substate);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.HIDE ], reducer: hide },
    { actions: [ actions.RESET_VERSION ], reducer: resetVersion },
    { actions: [ actions.SHOW ], reducer: show },
    { actions: [ actions.UPDATE_VERSION ], reducer: updateVersion },
]);
