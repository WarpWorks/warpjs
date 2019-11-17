import { NAME } from './../constants';
import * as SHAPES from './../shapes';

const { PropTypes } = window.WarpJS.ReactUtils;
const { errorBoundary } = window.WarpJS.ReactUtils;
const { RoundedCheckbox } = window.WarpJS.ReactComponents;

const Component = (props) => {
    if (!props.open) {
        return null;
    }

    if (!props.items) {
        return null;
    }

    const checkboxes = props.items.map((item) => {
        const checked = Boolean(props.selection &&
            (props.selection.relnId === props.relnId) &&
            (props.selection.entityId === props.entityId) &&
            (props.selection.firstLevelId === props.firstLevelId) &&
            (props.selection.secondLevelId === item.id)
        );

        return <RoundedCheckbox key={item.id} checked={checked} onClick={() => item.onClick(!item.checked)}>{item.name}</RoundedCheckbox>;
    });

    return <div className="warpjs-aggregation-filters-sub-selections">{checkboxes}</div>;
};

Component.displayName = `${NAME}SubSelections`;

Component.propTypes = {
    entityId: PropTypes.number.isRequired,
    firstLevelId: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(SHAPES.SUB_ITEM),
    open: PropTypes.bool,
    relnId: PropTypes.number.isRequired,
    selection: SHAPES.SELECTION
};

export default errorBoundary(Component);
