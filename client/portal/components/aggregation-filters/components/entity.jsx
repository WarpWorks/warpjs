import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';

import { NAME } from './../constants';

import Selection from './selection';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const selections = props.entity.items.map((item) => <Selection key={item.id} relnId={props.relnId} entityId={props.entity.id} item={item} {...props} />);

    return (
        <Panel>
            <Panel.Heading>{props.entity.name}</Panel.Heading>
            <Panel.Body>
                {selections}
            </Panel.Body>
        </Panel>
    );
};

Component.displayName = `${NAME}Entity`;

Component.propTypes = {
    entity: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        items: PropTypes.array.isRequired
    }),
    relnId: PropTypes.number.isRequired
};

export default errorBoundary(Component);
