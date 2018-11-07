import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';

// import debug from 'debug';
// const log = debug('W2:client:react-utils/create-store');

export default (reducers, initialState) => {
    const middlewares = [];

    let composeEnhanders = compose;

    if (process.env.NODE_ENV === 'development') {
        middlewares.push(createLogger());

        if (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
            composeEnhanders = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        }
    }

    return createStore(reducers, initialState, composeEnhanders(applyMiddleware(...middlewares)));
};
