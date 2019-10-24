import React from 'react';

import warpjsUtils from '@warp-works/warpjs-utils';

// import _debug from './debug'; const debug = _debug('community-image');

const { PropTypes } = warpjsUtils.reactUtils;

const Component = (props) => {
    return (
        <img className="community-image" src={props.image.href} alt={props.image.title || props.label} />
    );
};

Component.displayName = 'HtmlExportCommunityImage';

Component.propTypes = {
    image: PropTypes.shape({
        href: PropTypes.string.isRequired,
        title: PropTypes.string
    }),
    label: PropTypes.string.isRequired
};

export default Component;
