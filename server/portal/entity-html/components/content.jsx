import PropTypes from 'prop-types';
import React from 'react';

import BackToToc from './back-to-toc';
import constants from './../../entity-pdf/constants';
// import _debug from './debug'; const debug = _debug('content');
import Community from './community';
import Paragraph from './paragraph';
import TocNumber from './toc-number';

const Component = (props) => {
    const content = (items) => items.map((item) => {
        let subContent;

        if (item.type === constants.TYPES.COMMUNITY) {
            subContent = <Community items={item._embedded.items} />;
        } else if (item.type === constants.TYPES.PARAGRAPH) {
            subContent = <Paragraph item={item} />;
        }

        return (
            <div key={item.id} id={`section-${item.tocNumber}`} className="content-section">
                <div className="title">
                    <TocNumber item={item} />
                    {item.heading || item.name}
                    <BackToToc item={item} />
                </div>
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
    items: PropTypes.array.isRequired
};

export default Component;
