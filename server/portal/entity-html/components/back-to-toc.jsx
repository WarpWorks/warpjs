import PropTypes from 'prop-types';
import React from 'react';

const Component = (props) => <span className="back-to-toc">(<a href={`#toc-${props.item.tocNumber}`}>TOC</a>)</span>;

Component.propTypes = {
    item: PropTypes.object.isRequired
};

export default Component;
