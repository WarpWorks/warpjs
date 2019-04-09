import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as actionCreators from './action-creators';
import Container from './container';
import reducers from './reducers';

const PLACEHOLDER = '#warpjs-following-toggle';

module.exports = async ($, data) => {
    console.log(`data=`, data);

    const store = window.WarpJS.ReactUtils.createStore(reducers, {}, [], process.env.NODE_ENV === 'development');
    store.dispatch(actionCreators.initializeState(true, 'some-url'));

    ReactDOM.render(
        <Provider store={store}>
          <Container />
        </Provider>,
        $(PLACEHOLDER).get(0)
    );
};
