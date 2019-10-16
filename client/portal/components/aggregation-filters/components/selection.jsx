import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Checkbox } from 'react-bootstrap';

import { NAME } from './../constants';

import SubSelections from './sub-selections';

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
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        items: PropTypes.array
    }),
    relnId: PropTypes.number.isRequired,
    selection: PropTypes.shape({
        relnId: PropTypes.number,
        entityId: PropTypes.number,
        firstLevelId: PropTypes.number,
        secondLevelId: PropTypes.number
    })
};

export default errorBoundary(Component);
