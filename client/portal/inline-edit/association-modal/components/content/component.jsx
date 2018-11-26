import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Button, Form, FormControl, ListGroup, ListGroupItem } from 'react-bootstrap';

import * as shapes from './../../../../../react-utils/shapes';

// import debug from './../../../../debug';
// const log = debug('client/portal/inline-editor/association-modal/components/content/component');


const Component = (props) => {
    const { FilterableList } = window.WarpJS.ReactComponents;

    const selected = props.relationship.targets.find((target) => target.selected);

    const selectComponent = (
        <FormControl componentClass="select" placeholder="Select type"
            defaultValue={selected.id}
            onChange={props.typeSelected}
            >
                {
                    props.relationship.targets.map((item) => (
                        <option key={item.id} value={item.id} selected={item.selected}>{item.name}</option>
                    ))
                }
        </FormControl>
    );

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

    const selectedTarget = props.relationship.targets.find((target) => target.selected);
    const targetItems = selectedTarget ? selectedTarget.entities : [];

    const componentRender = (inputComponent, filterValue) => {
        filterValue = (filterValue || '').toLowerCase();

        const items = targetItems
            .filter((item) => {
                if (alreadyAdded.indexOf(item.id) === -1) {
                    const name = item.name.toLowerCase();
                    return name.indexOf(filterValue) !== -1;
                } else {
                    return false;
                }
            })
            .map((item) => (
                <ListGroupItem key={item.id} className="warpjs-instances-item" onClick={() => addAssociation(item)}>
                    <Button bsStyle="primary" className="warpjs-action">add</Button>
                    <span className="warpjs-value">{item.name}</span>
                </ListGroupItem>
            ))
        ;

        return (
            <Fragment>
                <div>
                    <Form className="warpjs-types-select">{selectComponent}</Form>
                    <div className="warpjs-instances-list-filter">{inputComponent}</div>
                </div>
                <ListGroup className="warpjs-instances-list">{items}</ListGroup>
            </Fragment>
        );
    };

    return (
        <Fragment>
            <div className="warpjs-modal-close-button-container">
                <Button className="close" data-dismiss="modal" arial-label="Close" aria-hidden="true">&times;</Button>
            </div>
            <div className="warpjs-title">Add more {props.relationship.label}</div>
            <FilterableList
                componentId="association-modal-content"
                componentRender={componentRender}
            />
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
