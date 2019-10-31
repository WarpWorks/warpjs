import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default (PLACEHOLDER, Component) => {
    const { STORE } = window.WarpJS;

    const placeholder = document.getElementById(PLACEHOLDER);
    if (placeholder) {
        ReactDOM.render(
            <Provider store={STORE} id={PLACEHOLDER}><Component /></Provider>,
            placeholder
        );
    }
};
