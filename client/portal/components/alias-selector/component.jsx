import PropTypes from 'prop-types';
// import { Fragment } from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';

import { NAME } from './constants';

import _debug from './debug'; const debug = _debug('component');

const { Button } = window.WarpJS.ReactComponents;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    debug(`props=`, props);
    const { aliases } = props.page;

    if (aliases && aliases.length) {
        if (aliases.length > 1 || aliases[0].view) {
            debug(`length=${aliases.length}, view=${aliases[0].view}`);
            return (
                <FormControl.Static>Use <a href={props.page._links.edit.href}>Advanced editing</a> to manage.</FormControl.Static>
            );
        } else {
            return (
                <InputGroup>
                    <FormControl.Static>{aliases[0].name}</FormControl.Static>
                    <InputGroup.Button><Button label="Rename" glyph="pencil" style="primary" /></InputGroup.Button>
                </InputGroup>
            );
        }
    } else {
        return (
            <InputGroup>
                <FormControl.Static><i>No aliases defined</i></FormControl.Static>
                <InputGroup.Button><Button label="Create" glyph="pencil" style="primary" /></InputGroup.Button>
            </InputGroup>
        );
    }
};

Component.displayName = NAME;

Component.propTypes = {
    page: PropTypes.shape({
        aliases: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            version: PropTypes.string
        }))
    }),
    _links: PropTypes.object
};

export default errorBoundary(Component);
