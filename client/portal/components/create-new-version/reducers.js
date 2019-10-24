import actions from './actions';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('reducers');

const { concatenateReducers, getNamespaceSubstate, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const hide = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);

    substate.showCreate = false;

    return setNamespaceSubstate(state, namespace, substate);
};

const resetVersion = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);

    delete substate.nextVersion;

    return setNamespaceSubstate(state, namespace, substate);
};

const show = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);

    substate.showCreate = true;

    return setNamespaceSubstate(state, namespace, substate);
};

const updateVersion = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);

    substate.nextVersion = action.payload.nextVersion;

    return setNamespaceSubstate(state, namespace, substate);
};

export default concatenateReducers([
    { actions: [ actions.HIDE ], reducer: hide },
    { actions: [ actions.RESET_VERSION ], reducer: resetVersion },
    { actions: [ actions.SHOW ], reducer: show },
    { actions: [ actions.UPDATE_VERSION ], reducer: updateVersion }
]);
