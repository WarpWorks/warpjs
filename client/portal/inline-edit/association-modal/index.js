import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as actionCreators from './action-creators';
import constants from './../constants';
import Container from './container';
import reducers from './reducers';

const { bareModal, flattenHAL, proxy, toast } = window.WarpJS;
const { createStore } = window.WarpJS.ReactUtils;

module.exports = async ($, element) => {
    const data = {
        elementType: $(element).data('warpjsType'),
        elementId: $(element).data('warpjsId'),
        reference: {
            type: $(element).data('warpjsReferenceType'),
            id: $(element).data('warpjsReferenceId')
        }
    };

    const toastLoading = toast.loading($, "Loading data...", "Loading");
    try {
        const res = await proxy.post($, $(element).data('warpjsUrl'), data);
        const state = flattenHAL(res);

        const store = createStore(reducers, {}, [], process.env.NODE_ENV === 'development');
        if (state && state.instances && state.instances.length) {
            store.dispatch(actionCreators.initializeState(state.instances[0]));
        }

        const modal = bareModal($, constants.MODAL_NAME);
        constants.onClose(modal);

        ReactDOM.render(
            <Provider store={store}>
                <Container />
            </Provider>,
            $('.modal-dialog > .modal-content', modal).get(0)
        );

        modal.modal('show');
    } catch (err) {
        console.error("Error:", err);
        toast.error($, err.message, "Error getting data");
    } finally {
        toast.close($, toastLoading);
    }
};
