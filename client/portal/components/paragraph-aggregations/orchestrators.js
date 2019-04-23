import * as actionCreators from './action-creators';

// import _debug from './debug'; const debug = _debug('orchestrators');

export const updateAggregation = async (dispatch, aggregations, warpjsData, currentAggregationId, aggregationId) => {
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

        const result = await window.WarpJS.proxy.post($, aggregation._links.self.href, data);
        if (result && result.error) {
            await window.WarpJS.toast.error($, "Unable to update aggregation");
        } else {
            await window.WarpJS.toast.success($, "Updated aggregation");
            dispatch(actionCreators.updateAggregation(aggregationId));
        }
    } catch (err) {
        await window.WarpJS.toast.error($, "Unable to update aggregation");
    } finally {
        await window.WarpJS.toast.close($, toastLoading);
    }
}
