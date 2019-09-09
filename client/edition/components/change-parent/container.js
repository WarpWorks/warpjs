import pageHalNamespace from './../../../components/page-hal/namespace';

import Component from './component';
import { orchestrators } from './flux';
import namespace from './namespace';

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => {
    const pageHal = getNamespaceSubstate(state, pageHalNamespace);

    const subState = getNamespaceSubstate(state, namespace);

    const documents = subState.selectedType ? subState.instances[subState.selectedType] : null;

    return Object.freeze({
        documents,
        title: pageHal && pageHal._links && pageHal._links.changeParent ? pageHal._links.changeParent.title : null,
        url: pageHal && pageHal._links && pageHal._links.changeParent ? pageHal._links.changeParent.href : null,
        ...subState
    });
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    hideModal: async () => orchestrators.hideModal(dispatch),
    selectInstance: async (instance) => orchestrators.selectInstance(dispatch, instance),
    selectType: async (type) => orchestrators.selectType(dispatch, type),
    showModal: (url) => async () => orchestrators.showModal(dispatch, url)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    showModal: dispatchProps.showModal(stateProps.url),
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
