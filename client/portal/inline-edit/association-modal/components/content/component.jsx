import PropTypes from 'prop-types';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, Grid, ListGroup, ListGroupItem, Row } from 'react-bootstrap';

import * as shapes from './../../../../../react-utils/shapes';

// import debug from './../../../../debug';
// const log = debug('client/portal/inline-editor/association-modal/components/content/component');


const Component = (props) => {
    const { FilterableList } = window.WarpJS.ReactComponents;


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

    // Do not display element that are already part of the relationship.
    const alreadyAdded = props.relationship.items.map((item) => item.id);

    const filter = (filterValue, item) => {
        if (alreadyAdded.indexOf(item.id) === -1) {
            return item.name.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
        }
    }

    const listRender = (items, itemsRenderer) => {
        return (
            <ListGroup>
                {itemsRenderer()}
            </ListGroup>
        );
    };

    const itemRender = (item) => {
        return (
            <ListGroupItem key={item.id} className="warpjs-instances-item" onClick={() => addAssociation(item)}>
                <Glyphicon glyph="arrow-left" data-warpjs-action="add-association" />
                <span className="warpjs-value">{item.name}</span>
            </ListGroupItem>
        );
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
                            <FilterableList
                                componentId="association-modal-content"
                                filter={filter}
                                items={props.relationship.targets[0].entities}
                                listRender={listRender}
                                itemRender={itemRender}
                            />
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
