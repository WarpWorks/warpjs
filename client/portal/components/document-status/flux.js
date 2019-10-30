import { orchestrators as pageHalOrchestrators } from './../page-hal';
import pageHalNamespace from './../page-hal/namespace';

import { NAME } from './constants';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('flux');

const { proxy, toast } = window.WarpJS;
const { hideModalContainer, showModalContainer } = window.WarpJS.ReactComponents;
const { batch } = window.WarpJS.ReactUtils;
const { actionCreator, concatenateReducers, getNamespaceSubstate, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'UPDATE_STATUS'
]);

const actionCreators = Object.freeze({
    updateStatus: (documentStatus, promotion) => actionCreator(actions.UPDATE_STATUS, { documentStatus, promotion })
});

//
//  Orchestrators
//

export const orchestrators = Object.freeze({
    hideModal: async (dispatch, isDirty) => {
        batch(() => {
            hideModalContainer(dispatch, NAME);
            pageHalOrchestrators.refreshPage(dispatch, isDirty);
        });
    },
    promote: async (dispatch, item, setDirty) => {
        const toastLoading = toast.loading($, "Updating status");
        try {
            const res = await proxy.post($, item.href);
            batch(() => {
                dispatch(actionCreators.updateStatus(res.status.documentStatus, res.status.promotion));
                setDirty(dispatch);
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`*** ERROR *** updating status: err=`, err);
            toast.error($, "Error updating status");
        } finally {
            toast.close($, toastLoading);
        }
    },
    showModal: async (dispatch) => showModalContainer(dispatch, NAME)
});

export const reducers = concatenateReducers([{
    actions: [ actions.UPDATE_STATUS ],
    reducer: (state = {}, action) => {
        const subState = getNamespaceSubstate(state, pageHalNamespace);

        const page = subState && subState.pages && subState.pages.length
            ? subState.pages[0]
            : null;

        if (page) {
            page.status.documentStatus = action.payload.documentStatus;
            page.status.realStatus = action.payload.documentStatus;
            page.status.promotion = action.payload.promotion;
        }

        return setNamespaceSubstate(state, pageHalNamespace, subState);
    }
}]);
