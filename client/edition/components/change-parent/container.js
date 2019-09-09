import pageHalNamespace from './../../../components/page-hal/namespace';

import Component from './component';
import { orchestrators } from './flux';
import namespace from './namespace';

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const { hideModal, showModal } = orchestrators;

const mapStateToProps = (state, ownProps) => {
    const pageHal = getNamespaceSubstate(state, pageHalNamespace);

    const subState = getNamespaceSubstate(state, namespace);

    return Object.freeze({
        title: pageHal && pageHal._links && pageHal._links.changeParent ? pageHal._links.changeParent.title : null,
        url: pageHal && pageHal._links && pageHal._links.changeParent ? pageHal._links.changeParent.href : null,
        ...subState
    });
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    hideModal: async () => hideModal(dispatch),
    showModal: (url) => async () => showModal(dispatch, url)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    showModal: dispatchProps.showModal(stateProps.url),
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
