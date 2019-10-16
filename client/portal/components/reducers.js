import { reducers as aggregationEditorReducers } from './aggregation-editor';
import { reducers as aggregationFiltersReducers } from './aggregation-filters';
import { reducers as aliasSelectorReducers } from './alias-selector';
import { reducers as breadcrumbActionsReducers } from './breadcrumb-actions';
import { reducers as createNewVersionReducers } from './create-new-version';
import { reducers as documentEditionReducers } from './document-edition';
import { reducers as documentFiltersReducers } from './document-filters';
import { reducers as documentStatusReducers } from './document-status';
import { reducers as followDocumentReducers } from './follow-document';
import { reducers as paragraphAggregationsReducers } from './paragraph-aggregations';
import { reducers as pageHalReducers } from './page-hal';
import { reducers as userProfileDocumentsReducers } from './user-profile-documents';
import { reducers as userProfileMenuReducers } from './user-profile-menu';
import { reducers as userProfileNotificationsReducers } from './user-profile-notifications';

export default window.WarpJS.ReactUtils.concatenateReducers([
    aggregationEditorReducers,
    aggregationFiltersReducers,
    aliasSelectorReducers,
    breadcrumbActionsReducers,
    createNewVersionReducers,
    documentEditionReducers,
    documentFiltersReducers,
    documentStatusReducers,
    followDocumentReducers,
    paragraphAggregationsReducers,
    pageHalReducers,
    userProfileDocumentsReducers,
    userProfileMenuReducers,
    userProfileNotificationsReducers
]);
