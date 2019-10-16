import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';

import { NAME } from './../constants';

import Entity from './entity';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const entities = props.reln.entities.map((entity) => <Entity key={entity.id} entity={entity} {...props} />);

    return (
        <Panel>
            <Panel.Body>
                {entities}
            </Panel.Body>
        </Panel>
    );
};

Component.displayName = `${NAME}Relationship`;

Component.propTypes = {
    reln: PropTypes.shape({
        id: PropTypes.number.isRequired,
        entities: PropTypes.array.isRequired
    })
};

export default errorBoundary(Component);
