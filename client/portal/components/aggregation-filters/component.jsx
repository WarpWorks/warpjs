import { NAME, SECTIONS } from './constants';
import * as shapes from './shapes';

import EmptyResults from './components/empty-results';
import Sidebar from './components/sidebar';
import SearchField from './components/search-field';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    if (props.section === SECTIONS.INPUT) {
        return <SearchField {...props} />;
    } else if (props.section === SECTIONS.FILTERS) {
        return <Sidebar {...props} />;
    } else if (props.section === SECTIONS.EMPTY_RESULTS) {
        return <EmptyResults {...props} />;
    } else {
        return <div>*** NOT IMPLEMENTED *** {NAME} - section:{props.section}</div>;
    }
};

Component.displayName = NAME;

Component.propTypes = {
    section: shapes.SECTION
};

export default errorBoundary(Component);
