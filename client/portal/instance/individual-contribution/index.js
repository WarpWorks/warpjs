import React from 'react';
import ReactDOM from 'react-dom';

import Component from './component';

import debug from './../../debug';
const log = debug('client/portal/instance/individual-contribution/index');

module.exports = ($, data) => {
    const placeholder = document.getElementById('warpjs-individual-contribution-placeholder');
    if (placeholder) {
        const state = window.WarpJS.flattenHAL(data);
        log(`state=`, state);

        ReactDOM.render(<Component page={state.pages[0]} customMessages={state.customMessages}/>, placeholder);
    }
};
