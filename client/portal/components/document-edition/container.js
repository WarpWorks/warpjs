import extend from 'lodash/extend';

import pageHalNamespace from './../page-hal/namespace';
import Component from './component';
import namespace from './namespace';

import { orchestrators } from './flux';

const { getNamespaceSubstate } = window.WarpJS.ReactUtils;
const { hideModal, saveValue, showModal, updateValue } = orchestrators;

const mapStateToProps = (state, ownProps) => {
    const pageHalSubstate = getNamespaceSubstate(state, pageHalNamespace);

    if (pageHalSubstate.warpjsUser &&
        pageHalSubstate.pages &&
        pageHalSubstate.pages.length &&
        pageHalSubstate.pages[0]._links &&
        pageHalSubstate.pages[0]._links.edit) {

        const substate = getNamespaceSubstate(state, namespace);

        const page = extend({}, pageHalSubstate.pages[0], substate.editedValues);

        return {
            page,
            ...substate
        };

    } else {
        return {};
    }
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    hideModal: async () => hideModal(dispatch),
    showModal: async () => showModal(dispatch),
    saveValue: (url) => async (key, value) => saveValue(dispatch, url, key, value),
    updateValue: (key, value) => updateValue(dispatch, key, value)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    saveValue: dispatchProps.saveValue(stateProps.page._links.self.href),
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
