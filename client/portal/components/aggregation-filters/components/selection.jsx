import { Checkbox } from 'react-bootstrap';

import { NAME } from './../constants';
import * as SHAPES from './../shapes';

import SubSelections from './sub-selections';

const { Fragment, PropTypes } = window.WarpJS.ReactUtils;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const checked = Boolean(props.selection &&
        (props.selection.relnId === props.relnId) &&
        (props.selection.entityId === props.entityId) &&
        (props.selection.firstLevelId === props.item.id)
    );

    return (
        <Fragment>
            <Checkbox checked={checked} onClick={(event) => props.item.onClick(event.target.checked)}>{props.item.name}</Checkbox>
            <SubSelections relnId={props.relnId} entityId={props.entityId} firstLevelId={props.item.id} open={checked} items={props.item.items} selection={props.selection} />
        </Fragment>
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
