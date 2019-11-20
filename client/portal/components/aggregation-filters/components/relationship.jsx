import { NAME } from './../constants';
import * as SHAPES from './../shapes';

import Entity from './entity';

const { Panel } = window.WarpJS.ReactUtils;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    if (props.reln.show) {
        const entities = props.reln.items.map((entity) => <Entity key={entity.id} entity={entity} />);

        return (
            <Panel>
                <Panel.Body>
                    {entities}
                </Panel.Body>
            </Panel>
        );
    } else {
        return null;
    }
};

Component.displayName = `${NAME}Relationship`;

Component.propTypes = {
    reln: SHAPES.RELATIONSHIP
};

export default errorBoundary(Component);
