import PropTypes from 'prop-types';
import React from 'react';

import { TYPES } from './../../entity-pdf/constants';
import BackToToc from './back-to-toc';
import Content from './content';
import TocNumber from './toc-number';

// import _debug from './debug'; const debug = _debug('paragraph');


const Component = (props) => {
    // debug(`props=`, props);

    let subDocumentContent = null;
    if (props.item._embedded && props.item._embedded.items && props.item._embedded.items.length) {
        subDocumentContent = props.item._embedded.items.map((item) => {
            // debug(`subDocumentContent item=`, item);

            const subContent = item.type === TYPES.PARAGRAPH
                ? <Component item={item} />
                : item._embedded
                    ? <Content items={item._embedded.items} />
                    : null
            ;

            return (
                <div key={item.id} className="sub-document" id={`section-${item.tocNumber}`}>
                    <div className="title">
                        <TocNumber item={item} />
                        {item.name || item.heading}
                        <BackToToc item={item} />
                    </div>
                    {subContent}
                </div>
            );
        });
    }

    let paragraphImage = null;
    if (props.item._embedded && props.item._embedded.images) {
        const image = props.item._embedded.images[0];
        paragraphImage = (
            <img src={image.base64} alt={image.caption} />
        );
    }

    return (
        <div className="paragraph">
            <div className="paragraph-content" dangerouslySetInnerHTML={{ __html: props.item.content }} />
            {subDocumentContent}
        </div>
    );
};

Component.displayName = 'HtmlExportParagraph';

Component.propTypes = {
    item: PropTypes.shape({
        heading: PropTypes.string,
        content: PropTypes.string,
        _embedded: PropTypes.object
    })
};

export default Component;
