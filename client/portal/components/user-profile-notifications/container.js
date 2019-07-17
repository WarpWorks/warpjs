import Component from './component';
import namespace from './namespace';
import { hideDetails, resetModal, showDetails } from './orchestrators';

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;

const mapStateToProps = (state, ownProps) => getSubstate(state, namespace);

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    hideDetails: async () => hideDetails(dispatch),
    resetModal: async () => resetModal(dispatch),
    showDetails: async (type, id) => showDetails(dispatch, type, id)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
