import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import CreateNewVersion from './../components/create-new-version';
import { init } from './../components/create-new-version/action-creators';

// import _debug from './debug'; const debug = _debug('create-new-version');

const PLACEHOLDER = 'warpjs-create-new-version';

export default () => {
    // debug(`PAGE_HAL=`, window.WarpJS.PAGE_HAL);
    const pageHal = window.WarpJS.PAGE_HAL;

    const canEdit = Boolean(pageHal.pages && pageHal.pages.length && pageHal.pages[0]._links && pageHal.pages[0]._links.edit);
    window.WarpJS.STORE.dispatch(init(canEdit, pageHal._links.createNewVersion));

    const placeholder = document.getElementById(PLACEHOLDER);

    ReactDOM.render(
        <Provider store={window.WarpJS.STORE} id={PLACEHOLDER}>
          <CreateNewVersion />
        </Provider>,
        placeholder
    );
};
