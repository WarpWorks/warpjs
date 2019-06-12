import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import CreateNewVersion from './../components/create-new-version';

// import _debug from './debug'; const debug = _debug('create-new-version');

const PLACEHOLDER = 'warpjs-create-new-version';

export default () => {
    const placeholder = document.getElementById(PLACEHOLDER);

    ReactDOM.render(
        <Provider store={window.WarpJS.STORE} id={PLACEHOLDER}>
          <CreateNewVersion />
        </Provider>,
        placeholder
    );
};
