import { reducers as userProfileDocumentsReducers } from './../user-profile-documents';
import { reducers as userProfileNotificationsReducers } from './../user-profile-notifications';

import actions from './actions';
import namespace from './namespace';

const { concatenateReducers, setNamespaceSubstate } = window.WarpJS.ReactUtils;
const { reducers } = window.WarpJS.ReactComponents;

export default concatenateReducers([
    {
        actions: [ actions.INITIAL_STATE ],
        reducer: (state = {}, action) => setNamespaceSubstate(state, namespace, action.payload)
    },
    userProfileDocumentsReducers,
    userProfileNotificationsReducers,
    reducers
]);
