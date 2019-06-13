import namespace from './namespace';

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const noop = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    return setSubstate(state, namespace, substate);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [], reducer: noop }
]);
