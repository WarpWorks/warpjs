import PropTypes from 'prop-types';
import { Col, Glyphicon, Grid, ListGroup, ListGroupItem, Row } from 'react-bootstrap';

import * as shapes from './../../../../../react-utils/shapes';

const Component = (props) => {
    const { AutoSaveField, BaseList } = window.WarpJS.ReactComponents;
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
            <ListGroupItem key={item.id} header={item.name}>
                <AutoSaveField componentId={item.id}
                    placeholder="Enter relationship description"
                    changed={props.updateAssociationDescription(item)}
                    save={props.syncAssociationDescription(item)}
                    value={item.relnDescription}
                />

                <div className="warpjs-actions">
                    <Glyphicon glyph="arrow-up" data-warpjs-action="move-up" onClick={moveUp} />
                    <Glyphicon glyph="arrow-down" data-warpjs-action="move-down" onClick={moveDown} />
                    <Glyphicon glyph="arrow-right" data-warpjs-action="delete" onClick={removeItem} />
                </div>
            </ListGroupItem>
        );
    };

    return (
        <Grid fluid className="warpjs-association-modal-list">
            <Row>
                <Col xs={12} className="warpjs-association-modal-title-container">
                    <div className="warpjs-label">
                        Document Name
                    </div>
                    <div className="warpjs-value">
                        {props.name}
                    </div>
                </Col>
                <Col xs={12} className="warpjs-association-modal-name-container">
                    <div className="warpjs-label">
                        Association Name
                    </div>
                    <div className="warpjs-value">
                        {props.relationship.label}
                    </div>
                </Col>
                <Col xs={12} className="warpjs-association-modal-items-container">
                    <div className="warpjs-label">
                        Associations
                    </div>
                    <div className="warpjs-value">
                        <BaseList items={items}
                            listRender={listRender}
                            itemRender={itemRender}
                        />
                    </div>
                </Col>
            </Row>
        </Grid>
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
