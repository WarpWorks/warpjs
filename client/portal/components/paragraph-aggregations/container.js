import Component from './component';
import namespace from './namespace';
import * as orchestrators from './orchestrators';

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;

const mapStateToProps = (state, ownProps) => getSubstate(state, namespace);

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    updateAggregation: (aggregations, warpjsData, currentId) => (newId) => orchestrators.updateAggregation(dispatch, aggregations, warpjsData, currentId, newId),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    updateAggregation: dispatchProps.updateAggregation(stateProps.aggregations, stateProps.warpjsData, stateProps.aggregationSelected),
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
