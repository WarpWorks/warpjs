import { NAME } from './../constants';
import * as SHAPES from './../shapes';

import SubSelections from './sub-selections';

const { PropTypes } = window.WarpJS.ReactUtils;
const { errorBoundary } = window.WarpJS.ReactUtils;
const { RoundedCheckbox } = window.WarpJS.ReactComponents;

const Component = (props) => {
    const checked = Boolean(props.selection &&
        (props.selection.relnId === props.relnId) &&
        (props.selection.entityId === props.entityId) &&
        (props.selection.firstLevelId === props.item.id)
    );

    return (
        <div className="warpjs-aggregation-filters-selection">
            <RoundedCheckbox checked={checked} onClick={() => props.item.onClick(!checked)}>{props.item.name}</RoundedCheckbox>
            <SubSelections relnId={props.relnId} entityId={props.entityId} firstLevelId={props.item.id} open={checked} items={props.item.items} selection={props.selection} />
        </div>
    );
};

Component.displayName = `${NAME}Selection`;

Component.propTypes = {
    entityId: PropTypes.number.isRequired,
    item: SHAPES.ITEM,
    relnId: PropTypes.number.isRequired,
    selection: SHAPES.SELECTION
};

export default errorBoundary(Component);
