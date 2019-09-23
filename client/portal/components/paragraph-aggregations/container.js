import Component from './component';
import namespace from './namespace';
import { orchestrators } from './flux';

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;

const mapStateToProps = (state, ownProps) => getSubstate(state, namespace);

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    updateAggregation: (aggregations, warpjsData, currentId, clickedElement) => (newId) => orchestrators.updateAggregation(dispatch, aggregations, warpjsData, currentId, clickedElement, newId),
    editAggregation: (url) => async () => orchestrators.editAggregation(dispatch, url)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    editAggregation: dispatchProps.editAggregation('change-this-url'),
    updateAggregation: dispatchProps.updateAggregation(stateProps.aggregations, stateProps.warpjsData, stateProps.aggregationSelected, stateProps.clickedElement),
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
