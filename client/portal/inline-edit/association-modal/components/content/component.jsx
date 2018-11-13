import PropTypes from 'prop-types';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, Grid, ListGroup, ListGroupItem, Row } from 'react-bootstrap';

import * as shapes from './../../../../../react-utils/shapes';

import debug from './../../../../debug';
const log = debug('client/portal/inline-editor/association-modal/components/content/component');


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

    const addAssociation = (item) => {
        return props.addAssociation(
            props.relationship.items,
            item,
            props.relationship._links.items.href,
            props.relationship._links.reorder.href
        );
    };

    const defineTargets = (target) => {
        const alreadyAdded = props.relationship.items.map((item) => item.id);
        log("alreadyAdded=", alreadyAdded);
        log("_links=", props.relationship._links);

        return target.entities.map((item) => {
            if (alreadyAdded.indexOf(item.id) === -1) {
                return (
                    <ListGroupItem key={item.id} className="warpjs-instances-item">
                        <Glyphicon glyph="arrow-left" data-warpjs-action="add-association"
                            onClick={() => addAssociation(item)}
                        />
                        <span className="warpjs-value">{item.name}</span>
                    </ListGroupItem>
                );
            } else {
                return null;
            }
        });
    };

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
                                {defineTargets(props.relationship.targets[0])}
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
    relationship: shapes.relationship,
    addAssociation: PropTypes.func.isRequired
};

export default Component;
