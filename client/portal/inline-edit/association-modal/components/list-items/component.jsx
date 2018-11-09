import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';

import Item from './../list-item';

const Component = (props) => {
    const items = props.items.map((item, index, items) => (
        <Item key={item.id} item={item}
            moveDown={() => props.moveDown(items, item)}
            moveUp={() => props.moveUp(items, item)} />
    ));

    return (
        <ListGroup>
            {items}
        </ListGroup>
    );
};

Component.displayName = 'AssociationModalListItems';

Component.propTypes = {
    moveDown: PropTypes.func.isRequired,
    moveUp: PropTypes.func.isRequired,
    items: PropTypes.array
};

export default Component;
