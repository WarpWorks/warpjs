import { ControlLabel, FormGroup } from 'react-bootstrap';

const { PropTypes } = window.WarpJS.ReactUtils;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => (
    <FormGroup controlId={props.controlId} validationState={props.validationState}>
        <ControlLabel>{props.label}:</ControlLabel>
        {props.content}
    </FormGroup>
);

Component.displayName = 'DocumentEditionFormGroup';

Component.propTypes = {
    content: PropTypes.node,
    controlId: PropTypes.string,
    label: PropTypes.string,
    validationState: PropTypes.string
};

export default errorBoundary(Component);
