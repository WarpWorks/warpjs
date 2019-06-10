import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as UserProfileMenu from './../components/user-profile-menu';

// import _debug from './debug'; const debug = _debug('index');

const PLACEHOLDER = 'warpjs-user-profile-menu';

export default async ($, data) => {
    if (data.warpjsUser && data.myPage) {
        window.WarpJS.STORE.dispatch(UserProfileMenu.initializeState(data.myPage, data._links.myDocuments.href, data._links.myNotifications.href));

        ReactDOM.render(
            <Provider store={window.WarpJS.STORE} id={PLACEHOLDER}>
                <UserProfileMenu.Container />
            </Provider>,
            $(`#${PLACEHOLDER}`).get(0)
        );
    }
};
