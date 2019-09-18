import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Alert, Glyphicon, ListGroup, ListGroupItem, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { NAME } from './constants';

import _debug from './debug'; const debug = _debug('component');

const { ModalContainer, Spinner } = window.WarpJS.ReactComponents;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    let footerButtons = null;
    let content = <Spinner />;

    if (props.error) {
        content = <Alert bsStyle="danger">{props.error}</Alert>;
    } else if (props.items) {
        footerButtons = [{
            label: 'new',
            style: 'primary',
            onClick: () => {
                debug(`new clicked.`);
            }
        }];

        const listGroupItems = props.items.map((item) => {
            return (
                <ListGroupItem key={item.id}>
                    {item.name}
                </ListGroupItem>
            );
        });

        content = <ListGroup>{listGroupItems}</ListGroup>;
    }

    return (
        <Fragment>
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit document aggregation</Tooltip>}>
                <span className="warpjs-inline-edit-context" onClick={props.showModal}>
                    <Glyphicon glyph="pencil" />
                </span>
            </OverlayTrigger>
            <ModalContainer id={NAME} title={props.title} footerButtons={footerButtons}>
                {content}
            </ModalContainer>
        </Fragment>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    error: PropTypes.string,
    items: PropTypes.array,
    showModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

export default errorBoundary(Component);
