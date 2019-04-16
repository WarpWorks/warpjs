import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as actionCreators from './action-creators';
import Container from './container';
import reducers from './reducers';

// import _debug from './debug'; const debug = _debug('index');

const PLACEHOLDER = '#warpjs-following-toggle';

module.exports = async ($, data) => {
    const store = window.WarpJS.ReactUtils.createStore(reducers, {}, [], process.env.NODE_ENV === 'development');
    if (data.warpjsUser) {
        store.dispatch(actionCreators.initializeState(data.isFollowing, data._links.follow.href, data._links.unfollow.href));
    }

    ReactDOM.render(
        <Provider store={store}>
          <Container />
        </Provider>,
        $(PLACEHOLDER).get(0)
    );
};
