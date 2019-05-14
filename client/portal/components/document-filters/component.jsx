import PropTypes from 'prop-types';
import { Checkbox, FormGroup } from 'react-bootstrap';

import { LABELS, KEYS } from './constants';

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

    return (
        <FormGroup className="warpjs-document-filters">
            {filters}
        </FormGroup>
    )
};

Component.displayName = 'DocumentFilters';

Component.propTypes = {
    byDate: PropTypes.func.isRequired,
    byName: PropTypes.func.isRequired,
    filters: PropTypes.object,
    updateFilter: PropTypes.func.isRequired,
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
