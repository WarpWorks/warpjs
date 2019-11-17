import { NAME } from './../constants';
import * as SHAPES from './../shapes';

import Selection from './selection';

// import _debug from './debug'; const debug = _debug('entity');

const { Panel, PropTypes } = window.WarpJS.ReactUtils;
const { errorBoundary } = window.WarpJS.ReactUtils;
const { Button } = window.WarpJS.ReactComponents;

const MAX_TO_DISPLAY_WITHOUT_NEED_BUTTON = 7;
const NUMBER_TO_DISPLAY_BEFORE_BUTTON = 5;

const Component = (props) => {
    let shouldShowAllButton;
    let showAllButton = null;

    const selections = props.entity.items.map((item, index, array) => {
        if (!props.entity.showingAll && (array.length > MAX_TO_DISPLAY_WITHOUT_NEED_BUTTON) && (index >= NUMBER_TO_DISPLAY_BEFORE_BUTTON)) {
            shouldShowAllButton = true;
            return null;
        }
        return <Selection key={item.id} relnId={props.relnId} entityId={props.entity.id} item={item} {...props} />;
    });

    if (shouldShowAllButton) {
        showAllButton = <Button className="warpjs-aggregation-filters-button" label="show all" style="primary" title={`Show all ${props.entity.name}`} onClick={props.entity.showAll} />;
    } else if (props.entity.showingAll) {
        showAllButton = <Button className="warpjs-aggregation-filters-button" label="show less" style="primary" title={`Show less ${props.entity.name}`} onClick={props.entity.showLess} />;
    }

    return (
        <Panel className="warpjs-aggregation-filters-entity">
            <Panel.Heading>{props.entity.name}</Panel.Heading>
            <Panel.Body>
                {selections}
                {showAllButton}
            </Panel.Body>
        </Panel>
    );
};

Component.displayName = `${NAME}Entity`;

Component.propTypes = {
    entity: SHAPES.ENTITY,
    relnId: PropTypes.number.isRequired
};

export default errorBoundary(Component);
