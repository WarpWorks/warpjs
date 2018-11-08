import PropTypes from 'prop-types';
import { Glyphicon, ListGroupItem } from 'react-bootstrap';

const Component = (props) => {
    return (
        <ListGroupItem header={props.item.name}>
            {props.item.relnDescription}

            <div className="warpjs-actions">
                <Glyphicon glyph="arrow-up" data-warpjs-action="move-up" onClick={props.moveUp} />
                <Glyphicon glyph="arrow-down" data-warpjs-action="move-down" />
                <Glyphicon glyph="trash" data-warpjs-action="delete" />
            </div>
        </ListGroupItem>
    );

};

Component.displayName = 'AssociationModalListItem';

Component.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        relnDescription: PropTypes.string
    }),
    deleteItem: PropTypes.func.isRequired,
    moveUp: PropTypes.func.isRequired
};

export default Component;
