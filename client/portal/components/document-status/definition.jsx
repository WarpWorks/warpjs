import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

import { ALL } from './../../../../lib/constants/document-status';
import { NAME } from './constants';

// import _debug from './debug'; const debug = _debug('definition');

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const tbody = ALL.map((documentStatus, index) => {
        const classNames = classnames(
            `warpjs-document-status`,
            `warpjs-document-status-${documentStatus}`
        );

        const prerequisites = props.customMessages[`ContentDocumentStatusModal${documentStatus}Prerequisites`];
        const visiblility = props.customMessages[`ContentDocumentStatusModal${documentStatus}Visibility`];

        return (
            <tr key={index}>
                <td><span className={classNames}>{documentStatus}</span></td>
                <td dangerouslySetInnerHTML={{ __html: prerequisites }}></td>
                <td dangerouslySetInnerHTML={{ __html: visiblility }}></td>
            </tr>
        );
    });

    return (
        <Table striped bordered>
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Prerequisites</th>
                    <th>Portal Visibility (Public!)</th>
                </tr>
            </thead>

            <tbody>{tbody}</tbody>
        </Table>
    );
};

Component.displayName = `${NAME}Definition`;

Component.propTypes = {
    customMessages: PropTypes.object.isRequired
};

export default errorBoundary(Component);
