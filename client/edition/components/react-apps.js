import launchApp from './../../react-utils/launch-app';

import Actions from './actions';

import _debug from './debug'; const debug = _debug('react-apps');

export default () => {
    debug(`called...`);
    launchApp('warpjs-actions-placeholder', Actions);
};
