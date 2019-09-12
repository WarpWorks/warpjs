import { Glyphicon } from 'react-bootstrap';

import { NAME } from './constants';

import _debug from './debug'; const debug = _debug('component');

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    debug(`props=`, props);

    return (
        <span className="warpjs-inline-edit-context">
            <Glyphicon glyph="pencil" />
        </span>
    );
};

Component.displayName = NAME;

Component.propTypes = {
};

export default errorBoundary(Component);
