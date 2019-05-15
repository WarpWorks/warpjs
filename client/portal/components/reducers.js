import { reducers as documentFiltersReducers } from './document-filters';
import { reducers as paragraphAggregationsReducers } from './paragraph-aggregations';
import { reducers as userProfileDocumentsReducers } from './user-profile-documents';
import { reducers as userProfileMenuReducers } from './user-profile-menu';
import { reducers as userProfileNotificationsReducers } from './user-profile-notifications';

export default window.WarpJS.ReactUtils.concatenateReducers([
    documentFiltersReducers,
    paragraphAggregationsReducers,
    userProfileDocumentsReducers,
    userProfileMenuReducers,
    userProfileNotificationsReducers,
]);
