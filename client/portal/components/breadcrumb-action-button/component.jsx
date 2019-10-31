import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';

const { errorBoundary } = window.WarpJS.ReactUtils;

const TYPES = [ 'default', 'document', 'danger' ];

const glyphicon = (glyph) => glyph ? <Glyphicon glyph={glyph} /> : null;

const Component = (props) => {
    const classNames = classnames(
        'warpjs-breadcrumb-action-button',
        `warpjs-breadcrumb-action-button-${props.type}`,
        { 'warpjs-breadcrumb-action-button-with-label': props.label }
    );

    const onClick = () => {
        if (props.click) {
            props.click();
        }
    };

    return (
        <span className={classNames} onClick={onClick} title={props.title}>
            {glyphicon(props.glyph)} {props.label}
        </span>
    );
};

Component.displayName = 'BreadcrumbActionButton';

Component.propTypes = {
    click: PropTypes.func,
    glyph: PropTypes.string,
    label: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string
};

Component.defaultProps = {
    type: TYPES[0]
};

export default errorBoundary(Component);
