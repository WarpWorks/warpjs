import PropTypes from 'prop-types';
import React from 'react';

import BackToToc from './back-to-toc';
import Content from './content';

// import _debug from './debug'; const debug = _debug('paragraph');

const Component = (props) => {
    // debug(`props=`, props);

    let subDocumentContent = null;
    if (props.item._embedded && props.item._embedded.items && props.item._embedded.items.length) {
        subDocumentContent = props.item._embedded.items.map((item) => {
            // debug(`subDocumentContent item=`, item);

            return (
                <div key={item.id} className="sub-document" id={`section-${item.tocNumber}`}>
                    <div className="title">{item.tocNumber} {item.name} <BackToToc item={item} /></div>
                    <Content items={item._embedded.items} />
                </div>
            );
        });
    }

    return (
        <div className="paragraph">
            <div className="paragraph-content" dangerouslySetInnerHTML={{__html: props.item.content}} />
            {subDocumentContent}
        </div>
    );
};

Component.displayName = 'HtmlExportParagraph';

Component.propTypes = {
    item: PropTypes.shape({
        heading: PropTypes.string,
        content: PropTypes.string,
        _embedded: PropTypes.object,
    })
};

export default Component;
