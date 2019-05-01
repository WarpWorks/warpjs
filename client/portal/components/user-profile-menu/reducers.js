import cloneDeep from 'lodash/cloneDeep';

import actions from './actions';
import namespace from './namespace';
import { reducers as userProfileDocumentsReducers } from './../user-profile-documents';
import { reducers as userProfileNotificationsReducers } from './../user-profile-notifications';

const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const initializeState = (state = {}, action) => {
    const substate = cloneDeep(action.payload);
    return setSubstate(state, namespace, substate);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.INITIAL_STATE ], reducer: initializeState },
    userProfileDocumentsReducers,
    userProfileNotificationsReducers,
    window.WarpJS.ReactComponents.reducers
]);
