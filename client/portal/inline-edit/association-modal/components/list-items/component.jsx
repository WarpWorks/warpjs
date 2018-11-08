import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';

import Item from './../list-item';

const Component = (props) => {
    const items = props.items.map((item, index, items) => <Item key={item.id} item={item}  moveUp={() => props.moveUp(items, item)}/>);

    return (
        <ListGroup>
            {items}
        </ListGroup>
    );
};

Component.displayName = 'AssociationModalListItems';

Component.propTypes = {
    items: PropTypes.array,
    moveUp: PropTypes.func.isRequired
};

export default Component;
