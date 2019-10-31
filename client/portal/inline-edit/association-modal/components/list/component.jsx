import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap';

import * as shapes from './../../../../../react-utils/shapes';

const { AutoSaveField, BaseList } = window.WarpJS.ReactComponents;

const Component = (props) => {
    const items = props.relationship.items;

    const listRender = (items, itemsRenderer) => {
        return (
            <ListGroup className="warpjs-associations-list">
                {itemsRenderer()}
            </ListGroup>
        );
    };

    const itemRender = (item) => {
        const moveUp = () => props.moveUp(items, item);
        const moveDown = () => props.moveDown(items, item);
        const removeItem = () => props.removeItem(items, item);

        return (
            <ListGroupItem key={item.id}>
                <div className="warpjs-actions">
                    <Glyphicon glyph="arrow-up" data-warpjs-action="move-up" onClick={moveUp} />
                    <Glyphicon glyph="arrow-down" data-warpjs-action="move-down" onClick={moveDown} />
                    <Glyphicon glyph="remove" data-warpjs-action="delete" onClick={removeItem} />
                </div>
                <div className="warpjs-header">{item.name}</div>
                <AutoSaveField componentId={item.id}
                    placeholder="Enter relationship description"
                    changed={props.updateAssociationDescription(item)}
                    save={props.syncAssociationDescription(item)}
                    value={item.relnDescription}
                />

            </ListGroupItem>
        );
    };

    return (
        <Fragment>
            <div className="warpjs-label">
                Document Name
            </div>
            <div className="warpjs-value">
                {props.name}
            </div>
            <div className="warpjs-label">
                {props.relationship.label}
            </div>
            <div className="warpjs-association-modal-list-item-items">
                <BaseList items={items}
                    listRender={listRender}
                    itemRender={itemRender}
                />
            </div>
        </Fragment>
    );
};

Component.displayName = 'AssociationModalList';

Component.propTypes = {
    moveDown: PropTypes.func.isRequired,
    moveUp: PropTypes.func.isRequired,
    name: PropTypes.string,
    relationship: shapes.relationship,
    removeItem: PropTypes.func.isRequired,
    syncAssociationDescription: PropTypes.func.isRequired,
    updateAssociationDescription: PropTypes.func.isRequired
};
export default Component;
