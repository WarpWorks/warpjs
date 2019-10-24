import cloneDeep from 'lodash/cloneDeep';

import actions from './actions';
import namespace from './namespace';
import { reducers as userProfileDocumentsReducers } from './../user-profile-documents';
import { reducers as userProfileNotificationsReducers } from './../user-profile-notifications';

const { reducers } = window.WarpJS.ReactComponents;
const { concatenateReducers, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const initializeState = (state = {}, action) => {
    const substate = cloneDeep(action.payload);
    return setNamespaceSubstate(state, namespace, substate);
};

export default concatenateReducers([
    { actions: [ actions.INITIAL_STATE ], reducer: initializeState },
    userProfileDocumentsReducers,
    userProfileNotificationsReducers,
    reducers
]);
