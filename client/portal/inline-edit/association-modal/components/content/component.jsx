import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Button, ControlLabel, Form, FormControl, FormGroup, Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap';

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
                    onChange={props.typeSelected}
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

    const selectedTarget = props.relationship.targets.find((target) => target.selected);
    const targetItems = selectedTarget ? selectedTarget.entities : [];

    return (
        <Fragment>
            <div className="warpjs-modal-close-button-container">
                <Button className="close" data-dismiss="modal" arial-label="Close" aria-hidden="true">&times;</Button>
            </div>
            <div className="warpjs-title">Select to add {props.relationship.label}</div>
            <Form inline className="warpjs-types-select">
                {defineSelect()}
            </Form>
            <div className="warpjs-instances-list">
                <FilterableList
                    componentId="association-modal-content"
                    filter={filter}
                    items={targetItems}
                    listRender={listRender}
                    itemRender={itemRender}
                    className="warpjs-instances-list"
                />
            </div>
        </Fragment>
    );
};

Component.displayName = 'AssociationModalContent';

Component.propTypes = {
    addAssociation: PropTypes.func.isRequired,
    relationship: shapes.relationship,
    typeSelected: PropTypes.func.isRequired
};

export default Component;
