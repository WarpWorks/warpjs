import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as actionCreators from './action-creators';
import Container from './container';
import reducers from './reducers';

// import _debug from './debug'; const debug = _debug('index');

const PLACEHOLDER = 'warpjs-user-profile-menu';

export default async ($, data) => {
    if (data.warpjsUser && data.myPage) {
        const store = window.WarpJS.ReactUtils.createStore(reducers, {}, [], process.env.NODE_ENV === 'development');

        store.dispatch(actionCreators.initializeState(data.myPage, data._links.myDocuments.href, data._links.myNotifications.href));

        ReactDOM.render(
            <Provider store={store} id={PLACEHOLDER}>
                <Container />
            </Provider>,
            $(`#${PLACEHOLDER}`).get(0)
        );
    }
};
