import { Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { NAME } from './constants';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const subComponent = (
        <Glyphicon glyph={props.icon} className="warpjs-action"
            data-warpjs-action={props.action}
            data-warpjs-url={props.url}
            disabled={props.disabled}
        />
    );

    const component = props.title
        ? <OverlayTrigger placement="top" overlay={<Tooltip>{props.title}</Tooltip>}>{subComponent}</OverlayTrigger>
        : subComponent
    ;

    return component;
};

Component.displayName = NAME;

Component.propTypes = {
};

export default errorBoundary(Component);
