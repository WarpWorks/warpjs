import pageHalNamespace from './../page-hal/namespace';

import { NAME } from './constants';
import namespace from './namespace';

import _debug from './debug'; const debug = _debug('flux');

const { proxy, toast } = window.WarpJS;
const { actionCreator, concatenateReducers, getNamespaceSubstate, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;
const { hideModalContainer, showModalContainer } = window.WarpJS.ReactComponents;

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
    hideModal: async (dispatch) => hideModalContainer(dispatch, NAME),
    promote: async (dispatch, item, setDirty) => {
        debug(`promote(): item=`, item);
        const toastLoading = toast.loading($, "Updating status");
        try {
            const res = await proxy.post($, item.href);
            dispatch(actionCreators.updateStatus(res.status.documentStatus, res.status.promotion));
            setDirty();
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

//
//  Reducers
//

const updateStatus = (state = {}, action) => {
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
};

export const reducers = concatenateReducers([
    { actions: [ actions.UPDATE_STATUS ], reducer: updateStatus }
]);
