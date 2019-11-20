import { NAME } from './../constants';
import * as SHAPES from './../shapes';

import LabelAndCount from './label-and-count';
import SubSelections from './sub-selections';

const { PropTypes } = window.WarpJS.ReactUtils;
const { errorBoundary } = window.WarpJS.ReactUtils;
const { RoundedCheckbox } = window.WarpJS.ReactComponents;

const Component = (props) => {
    return (
        <div className="warpjs-aggregation-filters-selection">
            <RoundedCheckbox checked={props.item.selected} onClick={() => props.item.onClick(!props.item.selected)}>
                <LabelAndCount label={props.item.label} count={props.item.docs.length} />
            </RoundedCheckbox>
            <SubSelections entityId={props.entityId} firstLevelId={props.item.id} open={props.item.selected} items={props.item.items} />
        </div>
    );
};

Component.displayName = `${NAME}Selection`;

Component.propTypes = {
    entityId: PropTypes.number.isRequired,
    item: SHAPES.ITEM
};

export default errorBoundary(Component);
