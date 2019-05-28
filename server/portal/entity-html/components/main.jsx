import PropTypes from 'prop-types';
import React from 'react';

import Content from './content';
import TableOfContent from './table-of-contents';

const STYLE = `
    .table-of-contents {
      margin-left: 50px;
    }

    .sub-document {
      margin-left: 10px;
      padding-left: 10px;
      border-left: thin solid;
    }

    .title {
      font-weight: bold;
      margin-top: 30px;
      margin-bottom: 10px;
    }

    .content-section {
      padding-left: 10px;
    }

    .community-item {
      width: 33%;
      float: left;
      padding-bottom: 10px;
    }

    .community-item .community-image {
      max-width: 50px;
      max-height: 50px;
      border-radius: 50%;
      float: left;
    }

    .community-item .community-info {
      padding-top: 30px;
      padding-left: 120px;
    }
`;

const Component = (props) => {
    return (
        <html>

        <head>
            <title>{props.type} / {props.name}</title>
            <link rel="shortcut icon" href="/public/favicon.ico" />
            <link rel="icon" href="/public/favicon.ico" />
            <style dangerouslySetInnerHTML={{__html: STYLE}}></style>
        </head>

        <body>
            <h1>{props.name}</h1>

            <TableOfContent items={props._embedded.items} />
            <Content items={props._embedded.items} />
        </body>
        </html>
    );
};

Component.displayName = 'HtmlExportMain';

Component.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    _embedded: PropTypes.object,
};

export default Component;
