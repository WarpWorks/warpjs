import Component from './component';
import { orchestrators } from './flux';
import namespace from './namespace';

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => getNamespaceSubstate(state, namespace);

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    showModal: (id, url) => async () => orchestrators.showModal(dispatch, id, url)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    showModal: dispatchProps.showModal(ownProps.id, ownProps.url),
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
