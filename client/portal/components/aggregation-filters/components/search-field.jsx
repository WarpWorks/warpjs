import PropTypes from 'prop-types';
import { FormControl, InputGroup } from 'react-bootstrap';

import { NAME } from './../constants';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    return (
        <InputGroup>
            <InputGroup.Addon>CRITERIA 1</InputGroup.Addon>
            <InputGroup.Addon>CRITERIA 2</InputGroup.Addon>
            <FormControl type="text" value={props.searchValue} placeholder="Enter search terms" />
        </InputGroup>
    );
};

Component.displayName = `${NAME}SearchField`;

Component.propTypes = {
    searchValue: PropTypes.string,
    section: PropTypes.oneOf([
        'input'
    ])
};

export default errorBoundary(Component);
