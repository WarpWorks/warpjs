import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';

const CLASSNAMES = classnames(
    'warpjs-breadcrumb-action-button',
    'warpjs-breadcrumb-action-button-with-label'
);

const Component = (props) => {
    if (!props.canEdit) {
        return null;
    }

    return (
        <span className={CLASSNAMES} title="Create new version">
            <Glyphicon glyph="duplicate" />
            New version
        </span>
    );
};

Component.propTypes = {
    canEdit: PropTypes.bool.isRequired,
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
