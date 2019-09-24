import Component from './component';
import { AGGREGATION_EDITOR_ID } from './constants';
import namespace from './namespace';
import { orchestrators } from './flux';

// import _debug from './debug'; const debug = _debug('container');

const { getNamespaceSubstate, wrapContainer } = window.WarpJS.ReactUtils;

const mapStateToProps = (state, ownProps) => {
    const substate = getNamespaceSubstate(state, namespace);

    const selectedRelationship = (substate.aggregations || []).find((aggregation) => aggregation.id === substate.aggregationSelected);
    const selectedUrl = selectedRelationship ? selectedRelationship._links.items.href : null;

    return {
        aggregationEditorId: AGGREGATION_EDITOR_ID,
        selectedRelationship,
        selectedUrl,
        ...substate
    };
};

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    updateAggregation: (aggregations, warpjsData, currentId, clickedElement) => (newId) => orchestrators.updateAggregation(dispatch, aggregations, warpjsData, currentId, clickedElement, newId),
    editAggregation: (id, url) => async () => orchestrators.editAggregation(dispatch, id, url)
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    editAggregation: dispatchProps.editAggregation(stateProps.aggregationEditorId, stateProps.selectedUrl),
    updateAggregation: dispatchProps.updateAggregation(stateProps.aggregations, stateProps.warpjsData, stateProps.aggregationSelected, stateProps.clickedElement),
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
