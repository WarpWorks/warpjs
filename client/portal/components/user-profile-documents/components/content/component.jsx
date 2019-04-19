import PropTypes from 'prop-types';
import { Checkbox, FormGroup } from 'react-bootstrap';

import ComponentItems from './../items';
import * as constants from './constants';

const Component = (props) => {
    const filters = constants.KEYS.map((key) => {
        const currentStatus = Boolean(props.filters && props.filters[key])

        return (
            <Checkbox inline key={key}
                checked={currentStatus}
                onChange={() => props.updateFilter(key, !currentStatus)}
                >
                {constants.CHECKBOX_LABELS[key]}
            </Checkbox>
        );
    });

    const filteredItems = (props.items || []).filter((item) => {
        if (!props.filters) {
            return true;
        } else if (props.filters.AUTHOR && item.relnType.author) {
            return true;
        } else if (props.filters.CONTRIBUTOR && item.relnType.contributor) {
            return true;
        } else if (props.filters.FOLLOW && item.relnType.follow) {
            return true;
        } else {
            return false;
        }
    });

    return (
        <div className="warpjs-user-profile-documents-content">
            <FormGroup className="warpjs-user-profile-documents-filters">{filters}</FormGroup>
            <ComponentItems items={filteredItems} />
        </div>
    );
};

Component.displayName = 'UserProfileDocumentsContent';

Component.propTypes = {
    filters: PropTypes.object,
    items: PropTypes.array,
    updateFilter: PropTypes.func.isRequired
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
