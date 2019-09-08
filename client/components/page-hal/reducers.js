import actions from './actions';
import namespace from './namespace';

// const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const init = (state = {}, action) => {
    return setSubstate(state, namespace, action.payload.pageHal);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.INIT ], reducer: init }
]);
