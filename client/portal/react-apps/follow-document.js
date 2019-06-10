import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import FollowDocument from './../components/follow-document';
import * as actionCreators from './../components/follow-document/action-creators';

const PLACEHOLDER = 'warpjs-following-toggle';

export default () => {
    const pageHal = window.WarpJS.PAGE_HAL;
    const placeholder = document.getElementById(PLACEHOLDER);

    if (pageHal.warpjsUser) {
        window.WarpJS.STORE.dispatch(actionCreators.initializeState(pageHal.isFollowing, pageHal._links.follow.href, pageHal._links.unfollow.href));
    } else {
        window.WarpJS.STORE.dispatch(actionCreators.initializeState(pageHal.isFollowing, '', ''));
    }

    ReactDOM.render(
        <Provider store={window.WarpJS.STORE} id={PLACEHOLDER}><FollowDocument /></Provider>,
        placeholder
    );
};
