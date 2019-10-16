import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';

import { NAME } from './../constants';

const { errorBoundary } = window.WarpJS.ReactUtils;

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

        return <Checkbox key={item.id} checked={checked} onClick={(event) => item.onClick(event.target.checked)}>{item.name}</Checkbox>;
    });

    const style = { marginLeft: '20px' };

    return <div style={style}>{checkboxes}</div>;
};

Component.displayName = `${NAME}SubSelections`;

Component.propTypes = {
    entityId: PropTypes.number.isRequired,
    firstLevelId: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
    })),
    open: PropTypes.bool,
    relnId: PropTypes.number.isRequired,
    selection: PropTypes.shape({
        relnId: PropTypes.number,
        entityId: PropTypes.number,
        firstLevelId: PropTypes.number,
        secondLevelId: PropTypes.number
    })
};

export default errorBoundary(Component);
