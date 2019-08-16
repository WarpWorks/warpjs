import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { FormControl, Glyphicon, InputGroup } from 'react-bootstrap';

import { NAME } from './constants';

const Button = window.WarpJS.ReactComponents.Button;

const addVersionLink = (elements, link, label) => {
    if (link) {
        elements.push(
            <Fragment>
                {' '}
                <a href={link.href}>{label} ({link.title})</a>
            </Fragment>
        );
    }
};

const Component = (props) => {
    let content;
    if (props.showCreate) {
        content = (
            <Fragment>
                <InputGroup.Addon>Enter version for new document:</InputGroup.Addon>
                <FormControl type="text" value={props.nextVersion} placeholder="Enter new version number"
                    onChange={(event) => props.updateVersion(event.target.value)}
                ></FormControl>
                <InputGroup.Addon><Glyphicon glyph="erase" onClick={props.resetVersion} /></InputGroup.Addon>
                <InputGroup.Button><Button label="Cancel" glyph="remove" style="danger" onClick={props.hide} /></InputGroup.Button>
                <InputGroup.Button><Button label="Create" glyph="ok" style="primary" onClick={props.createVersion} /></InputGroup.Button>
            </Fragment>
        );
    } else {
        const elements = [];
        elements.push(props.version);
        addVersionLink(elements, props.page._links.versionPredecessor, "Previous");
        addVersionLink(elements, props.page._links.versionSuccessor, "Next");
        addVersionLink(elements, props.page._links.lastVersionSuccessor, "Last");

        const newVersionButton = props.page._links.versionSuccessor || !props.page.versionable
            ? null
            : <InputGroup.Button><Button label="New version" glyph="duplicate" style="primary" onClick={props.show} /></InputGroup.Button>;

        content = (
            <Fragment>
                <FormControl.Static>{elements}</FormControl.Static>
                {newVersionButton}
            </Fragment>
        );
    }

    return (
        <InputGroup className={`warpjs-${NAME}`}>{content}</InputGroup>
    );
};

Component.displayName = NAME;

Component.propTypes = {
    createVersion: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    nextVersion: PropTypes.string,
    page: PropTypes.object,
    resetVersion: PropTypes.func.isRequired,
    show: PropTypes.func,
    showCreate: PropTypes.bool,
    updateVersion: PropTypes.func.isRequired,
    version: PropTypes.string.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
