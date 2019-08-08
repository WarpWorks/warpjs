import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { FormControl, HelpBlock, InputGroup } from 'react-bootstrap';

import DocumentEditionFormGroup from './../document-edition/form-group';
import { NAME } from './constants';

// import _debug from './debug'; const debug = _debug('component');

const { Button } = window.WarpJS.ReactComponents;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const { aliases } = props.page;

    let content;

    if (aliases && aliases.length) {
        if (aliases.length > 1 || aliases[0].view) {
            content = (
                <FormControl.Static>Use <a href={props.page._links.edit.href}>Advanced editing</a> to manage.</FormControl.Static>
            );
        } else if (props.inEditMode) {
            content = (
                <Fragment>
                    <InputGroup>
                        <FormControl value={props.editValue} onChange={(event) => props.updateEditValue(event.target.value)} />
                        <InputGroup.Button><Button label="Cancel" glyph="remove" style="danger" onClick={props.unsetEditMode} /></InputGroup.Button>
                        <InputGroup.Button><Button label="Rename" glyph="ok" style="primary" disabled={!props.actionButtonEnabled} onClick={props.renameAlias} /></InputGroup.Button>
                    </InputGroup>
                    {props.valueMessage ? <HelpBlock>{props.valueMessage}</HelpBlock> : null}
                </Fragment>
            );
        } else {
            content = (
                <InputGroup>
                    <FormControl.Static>{aliases[0].name}</FormControl.Static>
                    <InputGroup.Button><Button label="Rename" glyph="pencil" style="primary" onClick={props.setEditMode} /></InputGroup.Button>
                </InputGroup>
            );
        }
    } else if (props.inEditMode) {
        content = (
            <InputGroup>
                <InputGroup.Button><Button label="Cancel" glyph="remove" style="danger" onClick={props.unsetEditMode} /></InputGroup.Button>
                <InputGroup.Button><Button label="Create" glyph="ok" style="primary" /></InputGroup.Button>
            </InputGroup>
        );
    } else {
        content = (
            <InputGroup>
                <FormControl.Static><i>No aliases defined</i></FormControl.Static>
                <InputGroup.Button><Button label="Create" glyph="pencil" style="primary" onClick={props.setEditMode} /></InputGroup.Button>
            </InputGroup>
        );
    }

    return (
        <DocumentEditionFormGroup
            controlId={props.controlId}
            validationState={props.editValueState || null}
            label="Alias"
            content={content}
        />
    );
};

Component.displayName = NAME;

Component.propTypes = {
    actionButtonEnabled: PropTypes.bool,
    controlId: PropTypes.string,
    editValue: PropTypes.string,
    editValueState: PropTypes.string,
    inEditMode: PropTypes.bool,
    page: PropTypes.shape({
        aliases: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            version: PropTypes.string,
            view: PropTypes.string
        })),
        _links: PropTypes.object
    }),
    renameAlias: PropTypes.func,
    setEditMode: PropTypes.func,
    unsetEditMode: PropTypes.func,
    updateEditValue: PropTypes.func,
    valueMessage: PropTypes.string
};

export default errorBoundary(Component);
