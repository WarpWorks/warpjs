
import namespace from './namespace';

const { toast } = window.WarpJS;
const { actionCreator, concatenateReducers, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'INIT'
]);

const actionCreators = Object.freeze({
    init: (pageHal) => actionCreator(actions.INIT, { pageHal })
});

export const orchestrators = Object.freeze({
    init: (dispatch, pageHal) => dispatch(actionCreators.init(pageHal)),
    refreshPage: async (dispatch, isDirty) => {
        if (isDirty) {
            toast.loading($, "Data has been updated, page will be reloaded.", "Reload needed");
            setTimeout(() => document.location.reload(), 1500);
        }
    }
});

export const reducers = concatenateReducers([{
    actions: [ actions.INIT ],
    reducer: (state = {}, action) => setNamespaceSubstate(state, namespace, action.payload.pageHal)
}]);
