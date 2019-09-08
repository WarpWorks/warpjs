import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { NAME } from './constants';

const { errorBoundary } = window.WarpJS.ReactUtils;
const { ModalContainer } = window.WarpJS.ReactComponents;

const Component = (props) => {
    if (!props.url) {
        return null;
    }

    return (
        <Fragment>
            <OverlayTrigger placement="top" overlay={<Tooltip>{props.title}</Tooltip>}>
                <Glyphicon glyph="object-align-horizontal" className="warpjs-action" data-warpjs-action="change-parent" onClick={props.showModal} />
            </OverlayTrigger>
            <ModalContainer id={NAME} title={props.title}>
                <div>Hello.</div>
            </ModalContainer>
        </Fragment>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    showModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
};

Component.defaultProps = {
    title: "Link document to another parent"
};

export default errorBoundary(Component);
