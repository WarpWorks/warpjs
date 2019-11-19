import { selectors as pageHalSelectors } from './../page-hal';

import Component from './component';
import filterTiles from './filter-tiles';
import { orchestrators, selectors } from './flux';
import generateAggregationFilters from './generate-aggregation-filters';
import matchSearchValue from './match-search-value';
import * as shapes from './shapes';

import _debug from './debug'; const debug = _debug('container');

const { useDispatch, useEffect, useSelector } = window.WarpJS.ReactUtils;

const Container = (props) => {
    const dispatch = useDispatch();
    const substate = useSelector((state) => selectors.substate(state));
    const page = useSelector((state) => pageHalSelectors.pageSubstate(state));

    const pageView = page && page.pageViews && page.pageViews.length ? page.pageViews[0] : null;

    const matchedTiles = pageView.aggregationDocuments.filter((doc) => matchSearchValue(substate.searchValue, doc));
    const aggregationFilters = generateAggregationFilters(
        dispatch,
        pageView.aggregationFilters,
        pageView.aggregationFiltersItems,
        substate.showingAll,
        orchestrators.select,
        orchestrators.showAll,
        matchedTiles
    );
    const setSearchValue = (value) => orchestrators.setSearchValue(dispatch, value);
    const clearSearchValue = () => orchestrators.clearSearchValue(dispatch);

    useEffect(() => {
        if (!substate.initialized) {
            orchestrators.init(dispatch, pageView.aggregationDocuments, pageView.aggregationFilters, pageView.aggregationFiltersItems);
        }
        filterTiles(substate.selection, substate.searchValue, pageView.aggregationFiltersItems, pageView.aggregationDocuments);
    });

    return (
        <Component
            {...substate}
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
