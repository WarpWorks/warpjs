import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { ControlLabel, Form, FormControl, FormGroup, Glyphicon } from 'react-bootstrap';

import { NAME } from './constants';

const ModalContainer = window.WarpJS.ReactComponents.ModalContainer;

const PROPERTIES = {
    AUTHOR: 'document-edition-property-author',
    DESCRIPTION: 'document-edition-property-description',
    KEYWORDS: 'document-edition-property-keywords',
    STATUS: 'document-edition-property-status',
    TITLE: 'document-edition-property-title',
    VERSION: 'document-edition-property-version',
};

const Component = (props) => {
    if (!props.page) {
        return null;
    }

    const buttons = [{
        label: "Advanced editing",
        glyph: 'wrench',
        style: 'link',
        onClick: () => {
            document.location.href = props.page._links.edit.href;
        }
    }, {
        label: "Done",
        glyph: 'ok',
        style: 'primary',
        onClick: props.hideModal,
    }];

    return (
        <Fragment>
            <Glyphicon glyph="cog" className="warpjs-breadcrumb-action-button" onClick={props.showModal} />
            <ModalContainer id={NAME} title="Document properties" footerButtons={buttons}>
                <Form>
                    <FormGroup controlId={PROPERTIES.TITLE}>
                        <ControlLabel>Title:</ControlLabel>
                        <FormControl type="text" value={props.page.name} placeholder="Enter document name" />
                    </FormGroup>

                    <FormGroup controlId={PROPERTIES.VERSION}>
                        <ControlLabel>Version:</ControlLabel>
                        <FormControl.Static>{props.page.version}</FormControl.Static>
                    </FormGroup>

                    <FormGroup controlId={PROPERTIES.STATUS}>
                        <ControlLabel>Status:</ControlLabel>
                        <FormControl.Static>{props.page.status.documentStatus}</FormControl.Static>
                    </FormGroup>

                    <FormGroup controlId={PROPERTIES.DESCRIPTION}>
                        <ControlLabel>Description:</ControlLabel>
                        <FormControl type="text" value={props.page.description} />
                    </FormGroup>

                    <FormGroup controlId={PROPERTIES.KEYWORDS}>
                        <ControlLabel>Keywords:</ControlLabel>
                        <FormControl type="text" value={props.page.keywords} />
                    </FormGroup>

                    <FormGroup controlId={PROPERTIES.AUTHOR}>
                        <ControlLabel>Authors:</ControlLabel>
                        <FormControl type="text" value={props.page.author} />
                    </FormGroup>
                </Form>
            </ModalContainer>
        </Fragment>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    hideModal: PropTypes.func.isRequired,
    page: PropTypes.object,
    showModal: PropTypes.func.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
