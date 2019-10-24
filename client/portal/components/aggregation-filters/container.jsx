import extend from 'lodash/extend';

import { pageSubstate } from './../page-hal/selectors';

import Component from './component';
import filterTiles from './filter-tiles';
import { orchestrators } from './flux';
import generateAggregationFilters from './generate-aggregation-filters';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('container');

const { PropTypes, useDispatch, useEffect, useSelector } = window.WarpJS.ReactUtils;
const { getNamespaceSubstate, wrapHookContainer } = window.WarpJS.ReactUtils;

const getComponentProps = (props) => {
    const dispatch = useDispatch();
    const subState = useSelector((state) => getNamespaceSubstate(state, namespace));
    const page = useSelector((state) => pageSubstate(state));

    const pageView = page && page.pageViews && page.pageViews.length ? page.pageViews[0] : null;

    const aggregationFilters = generateAggregationFilters(dispatch, pageView.aggregationFilters, pageView.aggregationFiltersItems, orchestrators.select);
    const setSearchValue = (value) => orchestrators.setSearchValue(dispatch, value);
    const clearSearchValue = () => orchestrators.clearSearchValue(dispatch);

    useEffect(() => {
        filterTiles(subState.selection, subState.searchValue, pageView.aggregationFiltersItems);
    });

    return extend({}, subState, {
        section: props.section,
        aggregationFilters,
        setSearchValue,
        clearSearchValue
    });
};

const propTypes = {
    section: PropTypes.oneOf([
        'input',
        'filters'
    ])
};

export default wrapHookContainer(Component, getComponentProps, propTypes);
