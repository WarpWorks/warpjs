import { NAME, SECTIONS } from './constants';
import * as shapes from './shapes';

import EmptyResults from './components/empty-results';
import Sidebar from './components/sidebar';
import SearchField from './components/search-field';

const { Alert, errorBoundary, PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => {
    if (props.section === SECTIONS.INPUT) {
        return <SearchField filters={props.filters} searchValue={props.searchValue} setSearchValue={props.setSearchValue} clearSearchValue={props.clearSearchValue} />;
    } else if (props.section === SECTIONS.FILTERS) {
        return <Sidebar filters={props.filters} />;
    } else if (props.section === SECTIONS.EMPTY_RESULTS) {
        return <EmptyResults visibleTiles={props.visibleTiles} />;
    } else {
        return <Alert bsStyle="danger">*** NOT IMPLEMENTED *** {NAME} - section:{props.section}</Alert>;
    }
};

Component.displayName = NAME;

Component.propTypes = {
    clearSearchValue: PropTypes.func,
    filters: PropTypes.array,
    searchValue: PropTypes.string,
    section: shapes.SECTION,
    setSearchValue: PropTypes.func,
    visibleTiles: PropTypes.instanceOf(Set)
};

export default errorBoundary(Component);
