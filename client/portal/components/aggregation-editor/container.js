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
    injectIntoAssociations: (associations) => (associations || []).forEach((association) => {
        association.addFilter = async () => orchestrators.addFilter(dispatch, association);
    }),
    injectIntoItems: (items) => (items || []).forEach((item) => {
        item.goToPortal = async () => orchestrators.goToPortal(dispatch, item);
        item.remove = async () => orchestrators.removeDocument(dispatch, item);
    }),
    onHide: (isDirty) => async () => orchestrators.modalClosed(dispatch, isDirty),
    toggleFilters: () => orchestrators.toggleFilters(dispatch)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    createChild: dispatchProps.createChild(stateProps.url),
    injectIntoAssociations: dispatchProps.injectIntoAssociations(stateProps.associations),
    injectIntoItems: dispatchProps.injectIntoItems(stateProps.items),
    onHide: dispatchProps.onHide(stateProps.isDirty),
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
