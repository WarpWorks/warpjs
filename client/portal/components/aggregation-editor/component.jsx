import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Glyphicon } from 'react-bootstrap';

import { NAME } from './constants';

import _debug from './debug'; const debug = _debug('component');

const { ModalContainer } = window.WarpJS.ReactComponents;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    debug(`props=`, props);

    const footerButtons = null;

    return (
        <Fragment>
            <span className="warpjs-inline-edit-context" onClick={props.showModal}>
                <Glyphicon glyph="pencil" />
            </span>
            <ModalContainer id={NAME} title={props.title} footerButtons={footerButtons}>
                    Hello
            </ModalContainer>
        </Fragment>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    showModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

export default errorBoundary(Component);
