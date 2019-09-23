import PropTypes from 'prop-types';
import { Alert, ListGroup, ListGroupItem } from 'react-bootstrap';

import { NAME } from './constants';

import _debug from './debug'; const debug = _debug('component');

const { ModalContainer, Spinner } = window.WarpJS.ReactComponents;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    let footerButtons = null;
    let content = <Spinner />;

    if (props.error) {
        content = <Alert bsStyle="danger">{props.error}</Alert>;
    } else if (props.items) {
        // FIXME: Could have more than one target entity.
        if (props.entities && props.entities.length) {
            footerButtons = [ props.entities.map((entity) => ({
                label: `New ${entity.name}`,
                style: 'primary',
                onClick: () => debug(`clicked ${entity.name}`)
            })) ];
        }

        if (props.items.length) {
            const listGroupItems = props.items.map((item) => {
                const name = item.name || <i>Untitled</i>;

                return (
                    <ListGroupItem key={item.id}>
                        {name}
                    </ListGroupItem>
                );
            });

            content = <ListGroup>{listGroupItems}</ListGroup>;
        } else {
            content = <Alert bsStyle="warning">No aggregations found.</Alert>;
        }
    }

    return (
        <ModalContainer id={props.id} title={props.title} footerButtons={footerButtons}>
            {content}
        </ModalContainer>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    createChild: PropTypes.func.isRequired,
    entities: PropTypes.array,
    error: PropTypes.string,
    id: PropTypes.string.isRequired,
    items: PropTypes.array,
    showModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

export default errorBoundary(Component);
