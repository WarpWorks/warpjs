import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';

import { NAME } from './../constants';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    return (
        <div>
            <Checkbox>{props.item.name}</Checkbox>
        </div>
    );
};

Component.displayName = `${NAME}Selection`;

Component.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        items: PropTypes.array
    })
};

export default errorBoundary(Component);
