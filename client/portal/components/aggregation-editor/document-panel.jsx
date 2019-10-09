import PropTypes from 'prop-types';
import { Alert, ListGroup, ListGroupItem } from 'react-bootstrap';

import { NAME } from './constants';

const { ActionIcon } = window.WarpJS.ReactComponents;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    if (props.items && props.items.length) {
        const listGroupItems = props.items.map((item) => {
            const name = item.name || <i>Untitled</i>;

            return (
                <ListGroupItem key={item.id}>
                    {name}
                    <span className="pull-right">
                        <ActionIcon title={`View document`} glyph="eye-open" onClick={item.goToPortal} />
                        {/* <ActionIcon title={`Remove document`} glyph="trash" style="danger" onConfirm={item.remove} /> */}
                    </span>
                </ListGroupItem>
            );
        });

        return <ListGroup>{listGroupItems}</ListGroup>;
    } else {
        return <Alert bsStyle="warning">No aggregations found.</Alert>;
    }
};

Component.displayName = `${NAME}DocumentList`;

Component.propTypes = {
    items: PropTypes.array.isRequired
};

export default errorBoundary(Component);
