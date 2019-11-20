import { NAME } from './../constants';

const { Fragment, PropTypes } = window.WarpJS.ReactUtils;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    return (
        <Fragment>
            {props.label}
            {' '}
            <span className="result-count">({props.count})</span>
        </Fragment>
    );
};

Component.displayName = `${NAME}LabelAndCount`;

Component.propTypes = {
    count: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired
};

export default errorBoundary(Component);
