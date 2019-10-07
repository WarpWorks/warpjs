import Component from './component';
import { orchestrators } from './flux';
import namespace from './namespace';

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => {
    const substate = getNamespaceSubstate(state, namespace);

    return substate;
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    createChild: (url) => async (entity) => orchestrators.createChild(dispatch, url, entity),
    goToPortal: (items) => (items || []).forEach((item) => {
        item.goToPortal = async () => orchestrators.goToPortal(dispatch, item);
    }),
    removeDocument: (items) => (items || []).forEach((item) => {
        item.remove = async () => orchestrators.removeDocument(dispatch, item);
    }),
    toggleFilters: () => orchestrators.toggleFilters(dispatch)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    createChild: dispatchProps.createChild(stateProps.url),
    goToPortal: dispatchProps.goToPortal(stateProps.items),
    removeDocument: dispatchProps.removeDocument(stateProps.items),
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
