import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { pageSubstate } from './../page-hal/selectors';

import Component from './component';
import filterTiles from './filter-tiles';
import generateAggregationFilters from './generate-aggregation-filters';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('container');

const { getNamespaceSubstate } = window.WarpJS.ReactUtils;

const Container = (props) => {
    const dispatch = useDispatch();
    const subState = useSelector((state) => getNamespaceSubstate(state, namespace));
    const page = useSelector((state) => pageSubstate(state));

    const pageView = page && page.pageViews && page.pageViews.length ? page.pageViews[0] : null;

    const aggregationFilters = generateAggregationFilters(dispatch, pageView.aggregationFilters, pageView.aggregationFiltersItems);

    useEffect(() => {
        filterTiles(subState.selection, pageView.aggregationFiltersItems);
    });

    return <Component {...subState} section={props.section} aggregationFilters={aggregationFilters} />;
};

Container.propTypes = {
    section: PropTypes.oneOf([
        'input',
        'filters'
    ])
};

export default Container;
