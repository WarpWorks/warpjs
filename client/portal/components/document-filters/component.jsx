import cloneDeep from 'lodash/cloneDeep';
import { Checkbox, FormControl, FormGroup } from 'react-bootstrap';

import { LABELS, KEYS, SORT_KEYS, SORT_KEYS_LIST, SORT_LABELS } from './constants';

const { errorBoundary, Fragment, PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const filters = KEYS.map((key) => {
        const currentStatus = Boolean(props.filters && props.filters[key]);

        return (
            <Checkbox inline key={key}
                checked={currentStatus}
                onChange={() => props.updateFilter(key, !currentStatus)}
            >
                {LABELS[key]}
            </Checkbox>
        );
    });

    const sortedItems = cloneDeep(props.items);
    switch (props.sortBy) {
        case SORT_KEYS.DATE: {
            sortedItems.sort(props.byDate);
            break;
        }

        case SORT_KEYS.NAME: {
            sortedItems.sort(props.byName);
            break;
        }

        default: {
            console.error(`Unknown sortBy='${props.sortBy}'.`);
            break;
        }
    }

    const sorting = SORT_KEYS_LIST.map((key) => <option key={key} value={key}>{SORT_LABELS[key]}</option>);

    return (
        <Fragment>
            <FormControl className="warpjs-document-sort-by" componentClass="select" value={props.sortBy}
                onChange={(event) => props.updateSortBy(event)}>
                {sorting}
            </FormControl>
            <FormGroup className="warpjs-document-filters">
                {filters}
            </FormGroup>
            <props.RenderComponent items={sortedItems} filters={props.filters} />
        </Fragment>
    );
};

Component.displayName = 'DocumentFilters';

Component.propTypes = {
    byDate: PropTypes.func.isRequired,
    byName: PropTypes.func.isRequired,
    filters: PropTypes.shape({
        AUTHOR: PropTypes.bool,
        CONTRIBUTOR: PropTypes.bool,
        FOLLOW: PropTypes.bool
    }).isRequired,
    items: PropTypes.array.isRequired,
    sortBy: PropTypes.string.isRequired,
    updateFilter: PropTypes.func.isRequired,
    updateSortBy: PropTypes.func.isRequired
};

export default errorBoundary(Component);
