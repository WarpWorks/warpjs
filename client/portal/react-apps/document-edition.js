import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import DocumentEdition from './../components/document-edition';

const PLACEHOLDER = 'warpjs-document-edition';

export default () => {
    const placeholder = document.getElementById(PLACEHOLDER);
    if (placeholder) {
        ReactDOM.render(
            <Provider store={window.WarpJS.STORE} id={PLACEHOLDER}>
              <DocumentEdition />
            </Provider>,
            placeholder
        );
    }
};
