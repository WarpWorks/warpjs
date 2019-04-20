import PropTypes from 'prop-types';
import { Checkbox, FormControl, FormGroup } from 'react-bootstrap';

import ComponentItems from './../items';
import * as constants from './constants';

const byDate = (documentA, documentB) => {
    const lastUpdatedA = (new Date(documentA.lastUpdated)).getTime();
    const lastUpdatedB = (new Date(documentB.lastUpdated)).getTime();
    // We want the most recent on top.
    return lastUpdatedB - lastUpdatedA;
};

const byName = (documentA, documentB) => {
    const nameA = documentA.name.toLowerCase();
    const nameB = documentB.name.toLowerCase();

    return nameA.toString().localeCompare(nameB.toString());
};

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

    const sorting = constants.SORT_KEYS_LIST.map((key) => <option key={key} value={key}>{constants.SORT_LABELS[key]}</option>);

    switch (props.sortBy) {
        case constants.SORT_KEYS.DATE:
            filteredItems.sort(byDate);
            break;

        case constants.SORT_KEYS.NAME:
            filteredItems.sort(byName);
            break;

        default:
            console.error(`Unknown search type.`);
            break;
    }

    return (
        <div className="warpjs-user-profile-documents-content">
            <FormControl className="warpjs-user-profile-documents-sort" componentClass="select"
                value={props.sortBy}
                onChange={(event) => props.updateSortBy(event)}
                >
                {sorting}
            </FormControl>
            <FormGroup className="warpjs-user-profile-documents-filters">{filters}</FormGroup>
            <ComponentItems items={filteredItems} />
        </div>
    );
};

Component.displayName = 'UserProfileDocumentsContent';

Component.propTypes = {
    filters: PropTypes.object,
    items: PropTypes.array,
    sortBy: PropTypes.string.isRequired,
    updateFilter: PropTypes.func.isRequired,
    updateSortBy: PropTypes.func.isRequired,
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
