import PropTypes from 'prop-types';
import { FormControl, Glyphicon, ListGroupItem } from 'react-bootstrap';

const Component = (props) => {
    return (
        <ListGroupItem header={props.item.name}>
            <FormControl type="text" value={props.item.relnDescription}
                placeholder="Enter relationship description"
            />

            <div className="warpjs-actions">
                <Glyphicon glyph="arrow-up" data-warpjs-action="move-up" onClick={props.moveUp} />
                <Glyphicon glyph="arrow-down" data-warpjs-action="move-down" onClick={props.moveDown} />
                <Glyphicon glyph="trash" data-warpjs-action="delete" />
            </div>
        </ListGroupItem>
    );

};

Component.displayName = 'AssociationModalListItem';

Component.propTypes = {
    deleteItem: PropTypes.func.isRequired,
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        relnDescription: PropTypes.string
    }),
    moveDown: PropTypes.func.isRequired,
    moveUp: PropTypes.func.isRequired
};

export default Component;
