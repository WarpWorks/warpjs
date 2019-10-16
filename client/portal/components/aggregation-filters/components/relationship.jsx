import { Panel } from 'react-bootstrap';

import { NAME } from './../constants';
import * as SHAPES from './../shapes';

import Entity from './entity';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const entities = props.reln.entities.map((entity) => <Entity key={entity.id} relnId={props.reln.id} entity={entity} {...props} />);

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
    reln: SHAPES.RELATIONSHIP
};

export default errorBoundary(Component);
