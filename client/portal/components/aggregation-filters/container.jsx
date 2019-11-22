import { clone } from './../../../../lib/utils/set';
import { selectors as pageHalSelectors } from './../page-hal';

import byResultCount from './by-result-count';
import Component from './component';
import filterTiles from './filter-tiles';
import { orchestrators, selectors } from './flux';
import matchSearchValue from './match-search-value';
import * as shapes from './shapes';

// import _debug from './debug'; const debug = _debug('container');

const { useDispatch, useEffect, useSelector } = window.WarpJS.ReactUtils;

const Container = (props) => {
    const dispatch = useDispatch();
    const substate = useSelector((state) => selectors.substate(state));

    let visibleTiles = new Set(substate.documents);

    if (substate.filters) {
        const matchedTiles = new Set(substate.documents
            .filter((doc) => matchSearchValue(substate.searchValue, doc))
            .map((doc) => doc.docId)
        );

        visibleTiles = clone(matchedTiles);

        const selectedAggregation = substate.filters.find((filter) => filter.selected);
        substate.filters.forEach((aggregation) => {
            aggregation.show = selectedAggregation ? selectedAggregation.id === aggregation.id : true;
            aggregation.items.forEach((entity) => {
                entity.showAll = () => orchestrators.showAll(dispatch, aggregation.id, entity.id);
                entity.showLess = () => orchestrators.showAll(dispatch, aggregation.id, entity.id, false);

                entity.items.forEach((firstLevel) => {
                    firstLevel.onClick = () => orchestrators.select(dispatch, !firstLevel.selected, aggregation.id, entity.id, firstLevel.id);
                    firstLevel.onExpand = (event) => orchestrators.expand(event, dispatch, !firstLevel.expanded, aggregation.id, entity.id, firstLevel.id);
                    firstLevel.docs = firstLevel.docs.filter((doc) => matchedTiles.has(doc));

                    firstLevel.items.forEach((secondLevel) => {
                        secondLevel.onClick = () => orchestrators.select(dispatch, !secondLevel.selected, aggregation.id, entity.id, firstLevel.id, secondLevel.id);
                        secondLevel.docs = secondLevel.docs.filter((doc) => matchedTiles.has(doc));
                    });

                    firstLevel.items.sort(byResultCount);
                });

                entity.items.sort(byResultCount);
            });
        });
    }

    const setSearchValue = (value) => orchestrators.setSearchValue(dispatch, value);
    const clearSearchValue = () => orchestrators.clearSearchValue(dispatch);

    const page = useSelector((state) => pageHalSelectors.pageSubstate(state));

    useEffect(() => {
        if (!substate.initialized) {
            const pageView = page && page.pageViews && page.pageViews.length ? page.pageViews[0] : null;
            orchestrators.init(dispatch, pageView.aggregationDocuments, pageView.aggregationFilters, pageView.aggregationFiltersItems);
        } else {
            filterTiles(substate.searchValue, substate.filters, visibleTiles);
        }
    });

    return (
        <Component
            {...substate}
            section={props.section}
            setSearchValue={setSearchValue}
            clearSearchValue={clearSearchValue}
            visibleTiles={visibleTiles}
        />
    );
};

Container.propTypes = {
    section: shapes.SECTION
};

export default Container;
