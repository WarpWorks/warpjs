import PropTypes from 'prop-types';

import Sidebar from './components/sidebar';
import SearchField from './components/search-field';
import { NAME } from './constants';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    if (props.section === 'input') {
        return <SearchField {...props} />;
    } else if (props.section === 'filters') {
        return <Sidebar {...props} />;
    } else {
        return <div>{NAME} - section:{props.section}</div>;
    }
};

Component.displayName = NAME;

Component.propTypes = {
    section: PropTypes.oneOf([
        'input',
        'filters'
    ])
};

export default errorBoundary(Component);
