import React from 'react';

import warpjsUtils from '@warp-works/warpjs-utils';

const { PropTypes } = warpjsUtils.reactUtils;

const Component = (props) => <span className="back-to-toc">(<a href={`#toc-${props.item.tocNumber}`}>TOC</a>)</span>;

Component.propTypes = {
    item: PropTypes.object.isRequired
};

export default Component;
