import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as actionCreators from './action-creators';
import Container from './container';
import _debug from './debug';
import reducers from './reducers';

const debug = _debug('index');

const PLACEHOLDER = '#warpjs-following-toggle';

module.exports = async ($, data) => {
    debug(`data=`, data);

    const store = window.WarpJS.ReactUtils.createStore(reducers, {}, [], process.env.NODE_ENV === 'development');
    store.dispatch(actionCreators.initializeState(true, 'some-url'));

    ReactDOM.render(
        <Provider store={store}>
          <Container />
        </Provider>,
        $(PLACEHOLDER).get(0)
    );
};
