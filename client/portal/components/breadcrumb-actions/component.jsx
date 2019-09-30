import PropTypes from 'prop-types';

import { NAME } from './constants';
import BreadcrumbActionButton from './../breadcrumb-action-button';
import DocumentEdition from './../document-edition';
import FollowDocument from './../follow-document';

const Component = (props) => {
    const components = [];

    if (props.warpjsUser) {
        components.push(<FollowDocument />);
    }

    if (props.page._links.edit) {
        if (props.inEditMode) {
            components.push(<DocumentEdition setDirty={props.setDirty} />);
            components.push(
                <BreadcrumbActionButton
                    click={props.unsetEditMode}
                    glyph="remove"
                    label="Stop editing"
                    type="danger"
                    title="Hide inline edit"
                />
            );
        } else {
            components.push(
                <BreadcrumbActionButton
                    click={props.setEditMode}
                    glyph="pencil"
                    label="Edit"
                    title="Show inline edit"
                />
            );
        }
    }

    return components;
};

Component.displayName = NAME;

Component.propTypes = {
    inEditMode: PropTypes.bool,
    page: PropTypes.object.isRequired,
    setDirty: PropTypes.func.isRequired,
    setEditMode: PropTypes.func.isRequired,
    unsetEditMode: PropTypes.func.isRequired,
    warpjsUser: PropTypes.object
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
