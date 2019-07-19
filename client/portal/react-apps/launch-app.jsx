import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default (PLACEHOLDER, Component) => {
    const placeholder = document.getElementById(PLACEHOLDER);
    if (placeholder) {
        ReactDOM.render(
            <Provider store={window.WarpJS.STORE} id={PLACEHOLDER}><Component /></Provider>,
            placeholder
        );
    }
};
