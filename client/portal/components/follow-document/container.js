import Component from './component';
// import _debug from './debug'; const debug = _debug('container');
import namespace from './namespace';
import * as orchestrators from './orchestrators';

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => getNamespaceSubstate(state, namespace);

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    updateFollow: (url, current) => orchestrators.updateFollow(dispatch, url, current)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
