import { show as showUserProfileDocuments } from './../user-profile-documents';
import { show as showUserProfileNotifications } from './../user-profile-notifications';

export const showDocuments = async (dispatch, url) => showUserProfileDocuments(dispatch, url);
export const showNotifications = async (dispatch, url) => showUserProfileNotifications(dispatch, url);
