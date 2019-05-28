import PropTypes from 'prop-types';
import React from 'react';

import constants from './../../entity-pdf/constants';
// import _debug from './debug'; const debug = _debug('content');
import Community from './community';
import Paragraph from './paragraph';

const Component = (props) => {
    const content = (items) => items.map((item) => {
        let subContent;

        if (item.type === constants.TYPES.COMMUNITY) {
            subContent = <Community items={item._embedded.items} />;
        } else if (item.type === constants.TYPES.PARAGRAPH) {
            subContent = <Paragraph item={item} />;
        }

        return (
            <div key={item.id} id={item.id} className="content-section">
                <div className="title">{item.heading || item.name} (<a href={`#${item.id}-TOC`}>TOC</a>)</div>
                {subContent}
            </div>
        );
    });

    return (
        <div className="content">
            {content(props.items)}
        </div>
    );
};

Component.displayName = 'HtmlExportContent';

Component.propTypes = {
    items: PropTypes.array.isRequired,
};

export default Component;
