import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Alert, Col, Glyphicon, Grid, ListGroup, ListGroupItem, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import { NAME } from './constants';

const { errorBoundary } = window.WarpJS.ReactUtils;
const { ModalContainer, Spinner } = window.WarpJS.ReactComponents;

const Component = (props) => {
    if (!props.url) {
        return null;
    }

    let modalBody = null;

    if (props.documents) {
        modalBody = (
            <div>Have documents and types.</div>
        );
    } else if (props.types) {
        const leftPanel = props.types.map((aType) => <ListGroupItem key={aType.id} bsStyle={aType.selected ? 'info' : null}>{aType.name}</ListGroupItem>);

        const rightPanel = props.error
            ? <Alert bsStyle="danger">{props.error}</Alert>
            : <Spinner />
        ;

        modalBody = (
            <Grid fluid>
                <Row>
                    <Col xs={4}><ListGroup>{leftPanel}</ListGroup></Col>
                    <Col xs={8}>{rightPanel}</Col>
                </Row>
            </Grid>
        );
    } else {
        if (props.error) {
            modalBody = (
                <Alert bsStyle="danger">{props.error}</Alert>
            );
        } else {
            modalBody = (
                <div><Spinner /></div>
            );
        }
    }

    return (
        <Fragment>
            <OverlayTrigger placement="top" overlay={<Tooltip>{props.title}</Tooltip>}>
                <Glyphicon glyph="object-align-horizontal" className="warpjs-action" data-warpjs-action="change-parent" onClick={props.showModal} />
            </OverlayTrigger>
            <ModalContainer id={NAME} title={props.title}>
                {modalBody}
            </ModalContainer>
        </Fragment>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    documents: PropTypes.array,
    error: PropTypes.string,
    types: PropTypes.array,
    showModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
};

Component.defaultProps = {
    title: "Link document to another parent"
};

export default errorBoundary(Component);
