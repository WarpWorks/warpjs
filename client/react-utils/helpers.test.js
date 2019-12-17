import { JSDOM } from 'jsdom';
import React from 'react';

const { window } = new JSDOM('<!doctype html><html><body></body></html>');

global.window = window;

global.document = window.document;
global.navigator = {
    userAgent: 'JSDOM test'
};

global.React = React;

window.WarpJS = {
    ReactUtils: {},
    ReactComponents: {}
};
