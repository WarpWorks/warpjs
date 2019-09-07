import pageHalNamespace from './../page-hal/namespace';

import Component from './component';
import { orchestrators } from './flux';
// import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('container');

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;
const { hideModal, showModal } = orchestrators;

const mapStateToProps = (state, ownProps) => {
    const pageHalSubstate = getNamespaceSubstate(state, pageHalNamespace);

    const page = pageHalSubstate && pageHalSubstate.pages && pageHalSubstate.pages.length
        ? pageHalSubstate.pages[0]
        : null;

    return {
        status: page && page.status ? page.status.documentStatus : ''
    };
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    hideModal: async () => hideModal(dispatch),
    showModal: async () => showModal(dispatch)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
