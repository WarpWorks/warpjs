import PropTypes from 'prop-types';
import React from 'react';

import constants from './../../entity-pdf/constants';
import TocNumber from './toc-number';

// import _debug from './debug'; const debug = _debug('table-of-contents');

const Component = (props) => {
    const content = (items) =>  items.map((item) => {
        const subContent = item.type !== constants.TYPES.COMMUNITY && item._embedded && item._embedded.items && item._embedded.items.length
            ? <ul>{content(item._embedded.items)}</ul>
            : null;

        return (
            <li key={item.tocNumber} id={`toc-${item.tocNumber}`}>
                <TocNumber item={item} />
                <a href={`#section-${item.tocNumber}`}>{item.name || item.heading}</a>
                {subContent}
            </li>
        );
    });

    return (
        <div className="table-of-content">
            <div className="title">Table of contents</div>
            <ul className="table-of-content">
                {content(props.items)}
            </ul>
        </div>
    );
};

Component.displayName = 'HtmlExportTableOfContents';

Component.propTypes = {
    items: PropTypes.array.isRequired,
};

export default Component;
