import pageHalNamespace from './../../../components/page-hal/namespace';

import Component from './component';

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => {
    const pageHal = getNamespaceSubstate(state, pageHalNamespace);

    return Object.freeze({
        _links: pageHal._links,
        canEdit: pageHal.canEdit,
        isRootInstance: pageHal.isRootInstance
    });
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
