import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';

const glyphicon = (glyph) => glyph ? <Glyphicon glyph={glyph} /> : null;

const Component = (props) => {
    const classNames = classnames(
        'warpjs-breadcrumb-action-button',
        { 'warpjs-breadcrumb-action-button-with-label': props.label }
    );

    const onClick = () => {
        if (props.click) {
            props.click();
        }
    };

    return (
        <span className={classNames} onClick={onClick}>
            {glyphicon(props.glyph)} {props.label}
        </span>
    );
};

Component.displayName = 'BreadcrumbActionButton';

Component.propTypes = {
    click: PropTypes.func,
    glyph: PropTypes.string,
    label: PropTypes.string,
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
