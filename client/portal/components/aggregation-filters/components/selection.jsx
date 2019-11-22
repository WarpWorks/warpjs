import { NAME } from './../constants';
import * as SHAPES from './../shapes';

import LabelAndCount from './label-and-count';
import SubSelections from './sub-selections';

const { PropTypes } = window.WarpJS.ReactUtils;
const { errorBoundary } = window.WarpJS.ReactUtils;
const { ActionIcon, RoundedCheckbox } = window.WarpJS.ReactComponents;

const Component = (props) => {
    let expandIcon = null;

    if (props.item.items && props.item.items.length) {
        const actionIconTitle = props.item.expanded ? 'collapse' : 'expand';
        const actionIconGlyph = props.item.expanded ? 'chevron-up' : 'chevron-down';

        expandIcon = <ActionIcon className="pull-right" style="primary" glyph={actionIconGlyph} title={`${actionIconTitle} ${props.item.label}`} onClick={props.item.onExpand} />;
    }

    return (
        <div className="warpjs-aggregation-filters-selection">
            <RoundedCheckbox checked={props.item.selected} onClick={() => props.item.onClick(!props.item.selected)}>
                <LabelAndCount label={props.item.label} count={props.item.docs.length} />
                {expandIcon}
            </RoundedCheckbox>
            <SubSelections entityId={props.entityId} firstLevelId={props.item.id} open={props.item.expanded} items={props.item.items} />
        </div>
    );
};

Component.displayName = `${NAME}Selection`;

Component.propTypes = {
    entityId: PropTypes.number.isRequired,
    item: SHAPES.ITEM
};

export default errorBoundary(Component);
