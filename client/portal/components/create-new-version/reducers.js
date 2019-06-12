import actions from './actions';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('reducers');

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const resetVersion = (state = {}, action) => {
    const substate = getSubstate(state, namespace);

    delete substate.nextVersion;

    return setSubstate(state, namespace, substate);
};

const updateVersion = (state = {}, action) => {
    const substate = getSubstate(state, namespace);

    substate.nextVersion = action.payload.nextVersion;

    return setSubstate(state, namespace, substate);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.RESET_VERSION ], reducer: resetVersion },
    { actions: [ actions.UPDATE_VERSION ], reducer: updateVersion },
]);
