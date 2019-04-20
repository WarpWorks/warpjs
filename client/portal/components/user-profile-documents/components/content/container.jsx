import Component from './component';
import namespace from './namespace';
import * as orchestrators from './orchestrators';

// import _debug from './debug'; const debug = _debug('container');

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;

const mapStateToProps = (state, ownProps) => getSubstate(state, namespace);

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    updateFilter: async (attribute, nextState) => orchestrators.updateFilter(dispatch, attribute, nextState),
    updateSortBy: async (event) => orchestrators.updateSortBy(dispatch, event),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
