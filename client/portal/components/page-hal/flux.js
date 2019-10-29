
import namespace from './namespace';

const { actionCreator, concatenateReducers, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'INIT'
]);

const actionCreators = Object.freeze({
    init: (pageHal) => actionCreator(actions.INIT, { pageHal })
});

export const orchestrators = Object.freeze({
    init: (dispatch, pageHal) => dispatch(actionCreators.init(pageHal))
});

export const reducers = concatenateReducers([{
    actions: [ actions.INIT ],
    reducer: (state = {}, action) => setNamespaceSubstate(state, namespace, action.payload.pageHal)
}]);
