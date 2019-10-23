import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { pageSubstate } from './../page-hal/selectors';

import Component from './component';
import filterTiles from './filter-tiles';
import { orchestrators } from './flux';
import generateAggregationFilters from './generate-aggregation-filters';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('container');

const { getNamespaceSubstate } = window.WarpJS.ReactUtils;

const Container = (props) => {
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

    return (
        <Component {...subState}
            section={props.section}
            aggregationFilters={aggregationFilters}
            setSearchValue={setSearchValue}
            clearSearchValue={clearSearchValue}
        />
    );
};

Container.propTypes = {
    section: PropTypes.oneOf([
        'input',
        'filters'
    ])
};

export default Container;
