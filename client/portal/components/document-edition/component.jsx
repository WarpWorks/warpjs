import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { ControlLabel, Form, FormControl, FormGroup, Tab, Tabs } from 'react-bootstrap';

import AliasSelector from './../alias-selector';
import BreadcrumbActionButton from './../../components/breadcrumb-action-button';
import CreateNewVersion from './../create-new-version';
import { NAME } from './constants';

// import _debug from './debug'; const debug = _debug('component');

const { AutoSaveField, ModalContainer } = window.WarpJS.ReactComponents;

const PROPERTIES = {
    ALIAS: 'document-edition-property-alias',
    AUTHOR: 'document-edition-property-author',
    DESCRIPTION: 'document-edition-property-description',
    KEYWORDS: 'document-edition-property-keywords',
    STATUS: 'document-edition-property-status',
    TITLE: 'document-edition-property-title',
    VERSION: 'document-edition-property-version'
};

const Component = (props) => {
    if (!props.page) {
        return null;
    }

    const { page } = props;

    const buttons = [{
        label: "Advanced editing",
        glyph: 'wrench',
        style: 'link',
        onClick: () => {
            document.location.href = page._links.edit.href;
        }
    }, {
        label: "Done",
        glyph: 'ok',
        style: 'primary',
        onClick: props.hideModal
    }];

    const pageView = page && page.pageViews && page.pageViews.length ? page.pageViews[0] : null;
    const community = pageView && pageView.communities && pageView.communities.length ? pageView.communities[0] : null;
    const authors = community && community.authors && community.authors.length
        ? community.authors.map((author, index) => <Fragment key={index}>{index ? ', ' : null}{author.label}</Fragment>)
        : null
    ;

    return (
        <Fragment>
            <BreadcrumbActionButton click={props.showModal} glyph='list-alt' label="Meta" />
            <ModalContainer id={NAME} title="Document properties" footerButtons={buttons}>
                <Form>
                    <Tabs id="warpjs-document-edition-tab" animation={false}>
                        <Tab eventKey={1} title="Basics">
                            <FormGroup controlId={PROPERTIES.TITLE} className={`warpjs-${PROPERTIES.TITLE}`}>
                                <ControlLabel>Title:</ControlLabel>
                                <AutoSaveField componentId={PROPERTIES.TITLE}
                                    placeholder="Enter document name"
                                    value={page.name}
                                    changed={(event) => props.updateValue('name', event.target.value)}
                                    save={() => props.saveValue('name', page.name)}
                                />
                            </FormGroup>

                            <FormGroup controlId={PROPERTIES.VERSION} className={`warpjs-${PROPERTIES.VERSION}`}>
                                <ControlLabel>Version:</ControlLabel>
                                <CreateNewVersion />
                            </FormGroup>

                            <FormGroup controlId={PROPERTIES.STATUS} className={`warpjs-${PROPERTIES.STATUS}`}>
                                <ControlLabel>Status:</ControlLabel>
                                <FormControl.Static>{page.status.documentStatus}</FormControl.Static>
                            </FormGroup>

                            <FormGroup controlId={PROPERTIES.ALIAS} className={`warpjs-${PROPERTIES.ALIAS}`}>
                                <ControlLabel>Alias:</ControlLabel>
                                <AliasSelector />
                            </FormGroup>
                        </Tab>
                        <Tab eventKey={2} title="SEO">
                            <FormGroup controlId={PROPERTIES.DESCRIPTION} className={`warpjs-${PROPERTIES.DESCRIPTION}`}>
                                <ControlLabel>Description:</ControlLabel>
                                <AutoSaveField componentId={PROPERTIES.DESCRIPTION}
                                    placeholder="Description for document"
                                    value={page.description}
                                    changed={(event) => props.updateValue('description', event.target.value)}
                                    save={() => props.saveValue('description', page.description)}
                                />
                            </FormGroup>

                            <FormGroup controlId={PROPERTIES.KEYWORDS} className={`warpjs-${PROPERTIES.KEYWORDS}`}>
                                <ControlLabel>Keywords:</ControlLabel>
                                <AutoSaveField componentId={PROPERTIES.KEYWORDS}
                                    placeholder="Keywords for document"
                                    value={page.keywords}
                                    changed={(event) => props.updateValue('keywords', event.target.value)}
                                    save={() => props.saveValue('keywords', page.keywords)}
                                />
                            </FormGroup>

                            <FormGroup controlId={PROPERTIES.AUTHOR} className={`warpjs-${PROPERTIES.AUTHOR}`}>
                                <ControlLabel>Authors: (leave blank to auto-generate from associated authors)</ControlLabel>
                                <AutoSaveField componentId={PROPERTIES.AUTHOR}
                                    placeholder="Author for document (comma-separated)"
                                    value={page.author}
                                    changed={(event) => props.updateValue('author', event.target.value)}
                                    save={() => props.saveValue('author', page.author)}
                                />
                                {authors}
                            </FormGroup>
                        </Tab>
                    </Tabs>
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
    updateValue: PropTypes.func.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
