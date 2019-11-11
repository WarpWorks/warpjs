import { selectors as pageHalSelectors } from './../page-hal';

import Component from './component';
import filterTiles from './filter-tiles';
import { orchestrators, selectors } from './flux';
import generateAggregationFilters from './generate-aggregation-filters';
import * as shapes from './shapes';

// import _debug from './debug'; const debug = _debug('container');

const { useDispatch, useEffect, useSelector } = window.WarpJS.ReactUtils;

const Container = (props) => {
    const dispatch = useDispatch();
    const subState = useSelector((state) => selectors.substate(state));
    const page = useSelector((state) => pageHalSelectors.pageSubstate(state));

    const pageView = page && page.pageViews && page.pageViews.length ? page.pageViews[0] : null;

    const aggregationFilters = generateAggregationFilters(dispatch, pageView.aggregationFilters, pageView.aggregationFiltersItems, subState.showingAll, orchestrators.select, orchestrators.showAll);
    const setSearchValue = (value) => orchestrators.setSearchValue(dispatch, value);
    const clearSearchValue = () => orchestrators.clearSearchValue(dispatch);

    useEffect(() => {
        filterTiles(subState.selection, subState.searchValue, pageView.aggregationFiltersItems);
    });

    return (
        <Component
            {...subState}
            section={props.section}
            aggregationFilters={aggregationFilters}
            setSearchValue={setSearchValue}
            clearSearchValue={clearSearchValue}
        />
    );
};

Container.propTypes = {
    section: shapes.SECTION
};

export default Container;
