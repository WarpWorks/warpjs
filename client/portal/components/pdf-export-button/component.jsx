import PropTypes from 'prop-types';

import BreadcrumbActionButton from './../breadcrumb-action-button';

import { NAME } from './constants';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    if (props.show) {
        return (
            <BreadcrumbActionButton
                click={props.click}
                glyph="file"
                label="PDF Download"
                title="Download PDF of document"
                type="file"
            />
        );
    } else {
        return null;
    }
};

Component.displayName = NAME;

Component.propTypes = {
    click: PropTypes.func,
    show: PropTypes.bool.isRequired
};

export default errorBoundary(Component);
