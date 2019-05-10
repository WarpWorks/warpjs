import cloneDeep from 'lodash/cloneDeep';

import actions from './actions';
import namespace from './namespace';

import _debug from './debug'; const debug = _debug('reducers');

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const init = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    substate.error = false;
    substate.errorMessage = null;
    substate.err = null;
    substate.showDetailsFor = null;
    return setSubstate(state, namespace, substate);
};

const resetModal = (state = {}, action) => {
    debug(`resetModal()...`);
    const substate = getSubstate(state, namespace);
    substate.showDetailsFor = null;
    return setSubstate(state, namespace, substate);
};

const error = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    substate.error = true;
    substate.errorMessage = action.payload.message;
    substate.err = action.payload.err;
    return setSubstate(state, namespace, substate);
};

const hideDetails = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    substate.showDetailsFor = null;
    return setSubstate(state, namespace, substate);
};

const results = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    substate.error = false;
    substate.errorMessage = undefined;
    substate.err = undefined;
    substate.notifications = cloneDeep(action.payload.notifications);
    return setSubstate(state, namespace, substate);
};

const showDetails = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    substate.showDetailsFor = cloneDeep(action.payload);
    return setSubstate(state, namespace, substate);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ window.WarpJS.ReactUtils.INIT_TYPE ], reducer: init },
    { actions: [ actions.ERROR ], reducer: error },
    { actions: [ actions.HIDE_DETAILS ], reducer: hideDetails },
    { actions: [ actions.RESET_MODAL ], reducer: resetModal },
    { actions: [ actions.RESULTS ], reducer: results },
    { actions: [ actions.SHOW_DETAILS ], reducer: showDetails },
]);
