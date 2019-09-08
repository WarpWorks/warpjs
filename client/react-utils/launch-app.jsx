import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// import _debug from './debug'; const debug = _debug('launch-app');

export default (PLACEHOLDER, Component) => {
    // debug(`(PLACEHOLDER=${PLACEHOLDER}, Component=${Component.displayName})...`);

    const placeholder = document.getElementById(PLACEHOLDER);
    if (placeholder) {
        ReactDOM.render(
            <Provider store={window.WarpJS.STORE} id={PLACEHOLDER}><Component /></Provider>,
            placeholder
        );
    }
};
