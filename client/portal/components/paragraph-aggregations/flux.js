import constants from './../../inline-edit/constants';
import { orchestrators as aggregationEditorOrchestrators } from './../aggregation-editor';

import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('orchestrators');

const { actionCreator, baseAttributeReducer, baseNamespaceReducer, concatenateReducers, namespaceKeys } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'INITIAL_STATE',
    'UPDATE_AGGREGATION'
]);

export const actionCreators = Object.freeze({
    initialize: (aggregations, aggregationSelected, warpjsData, clickedElement) => actionCreator(actions.INITIAL_STATE, { aggregations, aggregationSelected, warpjsData, clickedElement }),

    updateAggregation: (aggregationSelected) => actionCreator(actions.UPDATE_AGGREGATION, { aggregationSelected })
});

//
//  orchestrators
//

export const orchestrators = Object.freeze({
    editAggregation: async (dispatch, id, url) => aggregationEditorOrchestrators.showModal(dispatch, id, url),

    updateAggregation: async (dispatch, aggregations, warpjsData, currentAggregationId, clickedElement, aggregationId) => {
        if (currentAggregationId === aggregationId) {
            // Same selection, ignore.
            return;
        }

        const toastLoading = await window.WarpJS.toast.loading($, "Updating aggregation...");
        try {
            const data = {
                type: warpjsData.type,
                id: warpjsData.id,
                referenceType: warpjsData.reference.type,
                referenceId: warpjsData.reference.id
            };

            const aggregation = aggregations.find((aggr) => aggr.id === aggregationId);

            const result = await window.WarpJS.proxy.post($, aggregation._links.updateParagraphAggregation.href, data);
            if (result && result.error) {
                await window.WarpJS.toast.error($, "Unable to update aggregation");
            } else {
                await window.WarpJS.toast.success($, "Updated aggregation");
                dispatch(actionCreators.updateAggregation(aggregationId));
                $(clickedElement).data('warpjsSubdocuments', aggregationId);
                constants.setDirty();
            }
        } catch (err) {
            await window.WarpJS.toast.error($, "Unable to update aggregation");
        } finally {
            await window.WarpJS.toast.close($, toastLoading);
        }
    }
});

//
//  Reducers
//

const initialize = (state = {}, action) => baseNamespaceReducer(state, namespace, action.payload);

const updateAggregation = (state = {}, action) => baseAttributeReducer(state, namespace, 'aggregationSelected', action.payload.aggregationSelected);

export const reducers = concatenateReducers([
    { actions: [ actions.INITIAL_STATE ], reducer: initialize },
    { actions: [ actions.UPDATE_AGGREGATION ], reducer: updateAggregation }
]);
