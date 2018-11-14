import PropTypes from 'prop-types';
// import { FormControl, Glyphicon, ListGroupItem } from 'react-bootstrap';
import { Glyphicon, ListGroupItem } from 'react-bootstrap';

const Component = (props) => {
    const AutoSaveField = window.WarpJS.ReactComponents.AutoSaveField;

    return (
        <ListGroupItem header={props.item.name}>
            <AutoSaveField
                componentId={props.item.id}
                placeholder="Enter relationship description"
                changed={props.updateAssociationDescription(props.item)}
                save={props.syncAssociationDescription(props.item)}
                value={props.item.relnDescription}
            />

            <div className="warpjs-actions">
                <Glyphicon glyph="arrow-up" data-warpjs-action="move-up" onClick={props.moveUp} />
                <Glyphicon glyph="arrow-down" data-warpjs-action="move-down" onClick={props.moveDown} />
                <Glyphicon glyph="trash" data-warpjs-action="delete" onClick={props.removeItem} />
            </div>
        </ListGroupItem>
    );
};

Component.displayName = 'AssociationModalListItem';

Component.propTypes = {
    deleteItem: PropTypes.func.isRequired,
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        relnDescription: PropTypes.string
    }),
    moveDown: PropTypes.func.isRequired,
    moveUp: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    syncAssociationDescription: PropTypes.func.isRequired,
    updateAssociationDescription: PropTypes.func.isRequired
};

export default Component;
