import { orchestrators as aggregationEditorOrchestrators } from './../aggregation-editor';

export const orchestrators = Object.freeze({
    showModal: async (dispatch, id, url) => aggregationEditorOrchestrators.showModal(dispatch, id, url)
});
