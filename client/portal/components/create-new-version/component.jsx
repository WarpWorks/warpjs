import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { ControlLabel, Form, FormControl, FormGroup, Glyphicon, InputGroup } from 'react-bootstrap';

import { NAME } from './constants';

const ModalContainer = window.WarpJS.ReactComponents.ModalContainer;

const CLASSNAMES = classnames(
    'warpjs-breadcrumb-action-button',
    'warpjs-breadcrumb-action-button-with-label'
);

const Component = (props) => {
    if (!props.url) {
        return null;
    }

    const buttons = [{
        label: "Cancel",
        glyph: 'remove',
        style: 'danger',
        onClick: props.hideModal,
    }, {
        label: "Create",
        glyph: 'ok',
        style: 'primary',
        onClick: props.createVersion,
    }];

    return (
        <Fragment>
            <span className={CLASSNAMES} title="Create new version" onClick={() => props.showModal()}>
                <Glyphicon glyph="duplicate" />
                New version
            </span>
            <ModalContainer id={NAME} size="small" title="Create new version of document" footerButtons={buttons}>
                <div>
                    <p>
                        The current version of the document is: <b>{props.version}</b>.
                    </p>

                    <p>
                        CHANGE THIS TEXT:
                        You will create a new version of the document tree. The
                        current document&rsquo;s version and all its
                        sub-documents&rsquo; version will be set to the value
                        below:
                    </p>
                </div>
                <Form inline>
                    <FormGroup controlId="createNewVersionInput">
                        <ControlLabel>New version:</ControlLabel>
                        <InputGroup>
                            <FormControl type="text" value={props.nextVersion} placeholder="Enter new version number"
                                onChange={(event) => props.updateVersion(event.target.value)}
                            ></FormControl>
                            <InputGroup.Addon><Glyphicon glyph="erase" onClick={props.resetVersion} /></InputGroup.Addon>
                        </InputGroup>
                    </FormGroup>

                </Form>
            </ModalContainer>
        </Fragment>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    createVersion: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    nextVersion: PropTypes.string,
    resetVersion: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    version: PropTypes.string,
    updateVersion: PropTypes.func.isRequired,
    url: PropTypes.string
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
