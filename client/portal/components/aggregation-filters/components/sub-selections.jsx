import { NAME } from './../constants';
import * as SHAPES from './../shapes';

import LabelAndCount from './label-and-count';

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
        return (
            <RoundedCheckbox key={item.id} checked={item.selected} onClick={() => item.onClick(!item.selected)}>
                <LabelAndCount label={item.label} count={item.docs.length} />
            </RoundedCheckbox>
        );
    });

    return <div className="warpjs-aggregation-filters-sub-selections">{checkboxes}</div>;
};

Component.displayName = `${NAME}SubSelections`;

Component.propTypes = {
    entityId: PropTypes.number.isRequired,
    firstLevelId: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(SHAPES.SUB_ITEM),
    open: PropTypes.bool
};

export default errorBoundary(Component);
