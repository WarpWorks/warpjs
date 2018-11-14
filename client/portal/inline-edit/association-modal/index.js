import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as actionCreators from './action-creators';
import constants from './../constants';
import Container from './container';
import reducers from './reducers';


module.exports = async ($, element) => {
    const data = {
        elementType: $(element).data('warpjsType'),
        elementId: $(element).data('warpjsId'),
        reference: {
            type: $(element).data('warpjsReferenceType'),
            id: $(element).data('warpjsReferenceId')
        }
    };

    const toastLoading = window.WarpJS.toast.loading($, "Loading data...", "Loading");
    try {

        const res = await window.WarpJS.proxy.post($, $(element).data('warpjsUrl'), data);
        const state = window.WarpJS.flattenHAL(res);

        const store = window.WarpJS.ReactUtils.createStore(reducers, {}, [], process.env.NODE_ENV === 'development');
        if (state && state.instances && state.instances.length) {
            store.dispatch(actionCreators.initializeState(state.instances[0]));
        }

        const modal = window.WarpJS.bareModal($, constants.MODAL_NAME);
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
        window.WarpJS.toast.error($, err.message, "Error getting data");
    } finally {
        window.WarpJS.toast.close($, toastLoading);
    }
};
