import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

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

    const subComponent = (
        <span className={classNames} onClick={onClick}>
            {glyphicon(props.glyph)} {props.label}
        </span>
    );

    if (props.title) {
        return (
            <OverlayTrigger placement="top" overlay={<Tooltip>{props.title}</Tooltip>}>
                {subComponent}
            </OverlayTrigger>
        );
    } else {
        return subComponent;
    }
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

export default window.WarpJS.ReactUtils.errorBoundary(Component);
