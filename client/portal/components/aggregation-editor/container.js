import Component from './component';
import { orchestrators } from './flux';
import namespace from './namespace';

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => {
    const substate = getNamespaceSubstate(state, namespace);

    return substate;
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    hideModal: async () => orchestrators.hideModal(dispatch),
    showModal: (url) => async (event) => orchestrators.showModal(dispatch, url, event)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    showModal: dispatchProps.showModal(ownProps.url),
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
