import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { ControlLabel, Form, FormControl, FormGroup, Glyphicon } from 'react-bootstrap';

import CreateNewVersion from './../create-new-version';
import { NAME } from './constants';

const { AutoSaveField, ModalContainer } = window.WarpJS.ReactComponents;

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
                        <AutoSaveField componentId={PROPERTIES.TITLE}
                            placeholder="Enter document name"
                            value={props.page.name}
                            changed={(event) => props.updateValue('name', event.target.value)}
                            save={() => props.saveValue('name', props.page.name)}
                        />
                    </FormGroup>

                    <FormGroup controlId={PROPERTIES.VERSION}>
                        <ControlLabel>Version:</ControlLabel>
                        <FormControl.Static>{props.page.version} <CreateNewVersion /></FormControl.Static>
                    </FormGroup>

                    <FormGroup controlId={PROPERTIES.STATUS}>
                        <ControlLabel>Status:</ControlLabel>
                        <FormControl.Static>{props.page.status.documentStatus}</FormControl.Static>
                    </FormGroup>

                    <FormGroup controlId={PROPERTIES.DESCRIPTION}>
                        <ControlLabel>Description:</ControlLabel>
                        <AutoSaveField componentId={PROPERTIES.DESCRIPTION}
                            placeholder="Enter SEO description for document"
                            value={props.page.description}
                            changed={(event) => props.updateValue('description', event.target.value)}
                            save={() => props.saveValue('description', props.page.name)}
                        />
                    </FormGroup>

                    <FormGroup controlId={PROPERTIES.KEYWORDS}>
                        <ControlLabel>Keywords:</ControlLabel>
                        <AutoSaveField componentId={PROPERTIES.KEYWORDS}
                            placeholder="Enter SEO keywords for document"
                            value={props.page.keywords}
                            changed={(event) => props.updateValue('keywords', event.target.value)}
                            save={() => props.saveValue('keywords', props.page.name)}
                        />
                    </FormGroup>

                    <FormGroup controlId={PROPERTIES.AUTHOR}>
                        <ControlLabel>Authors: (leave blank to auto-generate from associated authors)</ControlLabel>
                        <AutoSaveField componentId={PROPERTIES.AUTHOR}
                            placeholder="Enter SEO author for document (comma-separated)"
                            value={props.page.author}
                            changed={(event) => props.updateValue('author', event.target.value)}
                            save={() => props.saveValue('author', props.page.name)}
                        />
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
    saveValue: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    updateValue: PropTypes.func.isRequired,
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
