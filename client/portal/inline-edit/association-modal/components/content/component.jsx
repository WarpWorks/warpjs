// import PropTypes from 'prop-types';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, Grid, ListGroup, ListGroupItem, Row } from 'react-bootstrap';

import * as shapes from './../../../../../react-utils/shapes';


const Component = (props) => {
    const defineOptions = (items) => items.map((item) => (
        <option key={item.id} value={item.id} selected={item.selected}>{item.name}</option>
    ));

    const defineSelect = () => {
        const selected = props.relationship.targets.find((target) => target.selected);

        return (
            <FormGroup controlId="types-select">
                <ControlLabel>Select type: </ControlLabel>
                <FormControl componentClass="select" placeholder="Select type"
                    defaultValue={selected.id}
                    >
                    {defineOptions(props.relationship.targets)}
                </FormControl>
            </FormGroup>
        );
    };


    const defineTargets = (items) => items.map((item) => (
        <ListGroupItem key={item.id} className="warpjs-instances-item">
            <span className="warpjs-value">{item.name}</span>
            <Glyphicon glyph="plus" data-warpjs-action="add-association" />
        </ListGroupItem>
    ))

    return (
        <Grid fluid className="">
            <Row>
                <Col xs={12} className="warpjs-modal-close-button-container">
                    <Button className="close" data-dismiss="modal" arial-label="Close" aria-hidden="true">&times;</Button>
                </Col>
            </Row>
            <Row>
                <Col xs={12} className="warpjs-title">
                    Select association to add:
                </Col>
            </Row>
            <Row>
                <Col xs={12} className="">
                    <ListGroup>
                        <ListGroupItem className="warpjs-types-select">
                            <Form inline>
                                {defineSelect()}
                            </Form>
                        </ListGroupItem>

                        <ListGroupItem className="warpjs-instances-list">
                            <ListGroup>
                                {defineTargets(props.relationship.targets[0].entities)}
                            </ListGroup>
                        </ListGroupItem>
                    </ListGroup>
                </Col>
            </Row>
        </Grid>
    );
};

Component.displayName = 'AssociationModalContent';

Component.propTypes = {
    relationship: shapes.relationship
};

export default Component;
