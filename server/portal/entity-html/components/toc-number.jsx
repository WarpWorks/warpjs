import React from 'react';

import warpjsUtils from '@warp-works/warpjs-utils';

const { PropTypes } = warpjsUtils.reactUtils;

const Component = (props) => <span className="toc-number">{props.item.tocNumber}</span>;

Component.displayName = 'HtmlExportTocNumber';

Component.propTypes = {
    item: PropTypes.object.isRequired
};

export default Component;
