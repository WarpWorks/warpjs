import PropTypes from 'prop-types';
import React from 'react';

import constants from './../../entity-pdf/constants';
// import _debug from './debug'; const debug = _debug('table-of-contents');

const Component = (props) => {
    const content = (items) =>  items.map((item) => {
        // debug(`document level item=`, item);

        let subContent = null;
        if (item.type === constants.TYPES.PARAGRAPH) {
            // debug(`paragraph item`);
            if (item._embedded && item._embedded.items && item._embedded.items.length) {
                // debug(`paragraph has aggregation. Need add to TOC:`, item._embedded.items);
                const subTOC = item._embedded.items.map((subDocument) => {
                    // debug(`[subTOC]: subDocument=`, subDocument);

                    let subDocumentTOC = null;
                    if (subDocument && subDocument._embedded && subDocument._embedded.items && subDocument._embedded.items.length) {
                        // debug(`[subTOC]:     contains items`);
                        subDocumentTOC = (
                            <ul>
                                {content(subDocument._embedded.items)}
                            </ul>
                        );
                    }

                    return (
                        <li key={subDocument.id}><a href={`#${subDocument.id}`} id={`${subDocument.id}-TOC`}>{subDocument.name}</a>{subDocumentTOC}</li>
                    );
                });
                subContent = (
                    <ul>
                        {subTOC}
                    </ul>
                );
            }
        }

        return (
            <li key={item.id}>{item.tocNumber} <a href={`#section-${item.tocNumber}`} id={`toc-${item.tocNumber}`}>{item.heading || item.name}</a>{subContent}</li>
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
