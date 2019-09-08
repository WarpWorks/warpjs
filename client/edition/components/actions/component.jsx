import PropTypes from 'prop-types';

import * as shapes from './../../../react-utils/shapes';
import Action from './../action';

import { NAME } from './constants';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const actions = [];

    if (props._links.studio) {
        actions.push(<Action icon="wrench" action="goto" url={props._links.studio.href} title={props._links.studio.title} />);
    } else if (props._links.content) {
        actions.push(<Action icon="list" action="goto" url={props._links.content.href} title={props._links.content.title} />);
    }

    actions.push(<Action icon="time" action="change-logs" url={props._links.history.href} title="Change logs" />);

    if (props._links.preview) {
        actions.push(<Action icon="eye-open" action="goto" url={props._links.preview.href} title="Preview document" />);
    }

    actions.push(<Action icon="trash" action="delete" url={props._links.self.href} title="Remove document" disabled={!props.canEdit} />);

    if (props._links.sibling) {
        actions.push(<Action icon="share" action="add-sibling" url={props._links.sibling.href} title="Add sibling" disabled={!props.canEdit} />);
    }

    return actions;
};

Component.displayName = NAME;

Component.propTypes = {
    _links: PropTypes.objectOf(shapes.link),
    canEdit: PropTypes.bool,
    isRootInstance: PropTypes.bool
};

export default errorBoundary(Component);
