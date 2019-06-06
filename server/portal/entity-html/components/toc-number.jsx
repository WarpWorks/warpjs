import PropTypes from 'prop-types';
import React from 'react';

const Component = (props) => <span className="toc-number">{props.item.tocNumber}</span>;

Component.displayName = 'HtmlExportTocNumber';

Component.propTypes = {
    item: PropTypes.object.isRequired,
};

export default Component;
